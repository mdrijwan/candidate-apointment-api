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
  let update = 'SET #c_name = :name, email = :email, first_slot = :first_slot, second_slot = :second_slot, third_slot = :third_slot, updatedAt = :updatedAt'
  let value = { ':name': name, ':email': email, ':first_slot': data.first_slot, ':second_slot': data.second_slot, ':third_slot': data.third_slot, ':updatedAt': now }

  if (existingData === undefined) {
    update += ', createdAt = :createdAt'
    value = Object.assign(value, { ':createdAt': now })
  }

  if (data.first_slot === 'available' || data.second_slot === 'available' || data.third_slot === 'available') {
    update += ', availability = :availability'
    value = Object.assign(value, { ':availability': 'yes' })
  }

  if (data.first_slot === 'booked' && data.second_slot === 'booked' && data.third_slot === 'booked') {
    update += ', availability = :availability'
    value = Object.assign(value, { ':availability': 'no' })
  }

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
