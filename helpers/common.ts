import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()
const today = new Date().toISOString().slice(0, 10)
const now = new Date().getTime()

export async function getData (id, date, table) {
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

export async function createData (candidate: Candidate, table) {
  await dynamoDb.put({
    TableName : table,
    Item: candidate
  }).promise()
  return candidate
}

export async function updateData (id, data, table) {
  const date = data.date ? data.date : today
  const existingData = await getData(id, date, table)
  let update = 'SET updatedAt = :updatedAt'
  let value = {
    ':updatedAt': now
  }

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
  const result = await dynamoDb.update({
    TableName : table,
    Key: {
      id: id,
      date: date
    },
    ExpressionAttributeValues: value,
    UpdateExpression: update,
    ReturnValues: 'ALL_NEW'
  }).promise()
  return result.Attributes
}

export async function queryData (id, table) {
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

export async function scanData (id, table) {
  const result = await dynamoDb.scan({
    TableName : table,
    FilterExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id
    }
  }).promise()
  return result.Items
}

export const formatJSONResponse = (statusCode: number, response: any): any => {
  return {
    statusCode,
    body: JSON.stringify(response)
  }
}

export interface Candidate {
  id: string,
  date: string,
  first_slot: string,
  second_slot: string,
  third_slot: string,
  availability: string,
  createdAt: number,
  updatedAt: number
}
