import { DynamoDB } from 'aws-sdk'
import { Candidate } from './model'

const dynamoDb = new DynamoDB.DocumentClient()
const today = new Date().toISOString().slice(0, 10)
const now = new Date().getTime()
const table = process.env.TABLE_CANDIDATE

export async function getData (id, date) {
  let items: Candidate
  const result = await dynamoDb.get({
    TableName : table,
    Key: {
      id: id,
      date: date
    }
  }).promise()
  if (result.Item) {
    items = Object.assign(result.Item)
  }
  return items
}

export async function createData (item: Candidate) {
  await dynamoDb.put({
    TableName : table,
    Item: item
  }).promise()
  return item
}

export async function updateData (id, data) {
  const date = data.date ? data.date : today
  const existingData = await getData(id, date)
  const candidateName = await getName(id)
  let obj = candidateName.find(o => o.name)
  const name = obj.name
  const email = obj.email
  let update = 'SET #c_name = :name, email = :email, updatedAt = :updatedAt'
  let value = { ':updatedAt': now, ':name': name, ':email': email }
  console.log({
    d1: data.first_slot, d2: data.second_slot, d3: data.third_slot
  })

  if (existingData === undefined) {
    update += ', createdAt = :createdAt'
    value = Object.assign(value, { ':createdAt': now })
  }

  if (existingData === undefined && (data.first_slot === undefined || data.second_slot === undefined || data.third_slot === undefined)) {
    update += ', availability = :availability'
    value = Object.assign(value, { ':availability': 'yes' })
  }

  if (existingData === undefined && data.first_slot === undefined) {
    update += ', first_slot = :first_slot'
    value = Object.assign(value, { ':first_slot': 'available' })
  }

  if (existingData === undefined && data.second_slot === undefined) {
    update += ', second_slot = :second_slot'
    value = Object.assign(value, { ':second_slot': 'available' })
  }

  if (existingData === undefined && data.third_slot === undefined) {
    update += ', third_slot = :third_slot'
    value = Object.assign(value, { ':third_slot': 'available' })
  }

  if (data.first_slot === 'available' || data.second_slot === 'available' || data.third_slot === 'available') {
    update += ', availability = :availability'
    value = Object.assign(value, { ':availability': 'yes' })
  }

  if (existingData === undefined && data.first_slot === 'booked' && data.second_slot === 'booked' && data.third_slot === 'booked') {
    update += ', availability = :availability'
    value = Object.assign(value, { ':availability': 'no' })
  }

  if (data.first_slot != null) {
    update += ', first_slot = :first_slot'
    value = Object.assign(value, { ':first_slot': data.first_slot })
  }

  if (data.second_slot != null) {
    update += ', second_slot = :second_slot'
    value = Object.assign(value, { ':second_slot': data.second_slot })
  }

  if (data.third_slot != null) {
    update += ', third_slot = :third_slot'
    value = Object.assign(value, { ':third_slot': data.third_slot })
  }
  console.log({ 'update': update, 'value': value })

  const result = await dynamoDb.update({
    TableName : table,
    Key: {
      id: id,
      date: date
    },
    ExpressionAttributeValues: value,
    ExpressionAttributeNames: {
      '#c_name': 'name'
    },
    UpdateExpression: update,
    ReturnValues: 'ALL_NEW'
  }).promise()
  return result.Attributes
}

export async function queryData (id) {
  const result = await dynamoDb.query({
    TableName : table,
    IndexName : 'Candidate-index',
    KeyConditionExpression: 'id = :id and availability = :availability',
    ExpressionAttributeValues: {
      ':id': id,
      ':availability': 'yes'
    }
  }).promise()
  return result.Items
}

export async function scanData (id) {
  const result = await dynamoDb.scan({
    TableName : table,
    FilterExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id
    }
  }).promise()
  return result.Items
}

export async function scanTable () {
  const result = await dynamoDb.scan({
    TableName : table
  }).promise()
  return result.Items
}

export async function getName (id) {
  const result = await dynamoDb.query({
    TableName : table,
    KeyConditionExpression: 'id = :id',
    FilterExpression: 'attribute_exists(#c_name)',
    ExpressionAttributeValues: {
      ':id': id
    },
    ExpressionAttributeNames: {
      '#c_name': 'name'
    }
  }).promise()
  return result.Items
}
