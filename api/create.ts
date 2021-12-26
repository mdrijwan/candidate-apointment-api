import * as uuid from 'uuid'
import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()
const table = process.env.TABLE_CANDIDATE
const today = new Date().toISOString().slice(0, 10)
const now = new Date().getTime()

export const candidate = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  const data = JSON.parse(event.body)
  const params = {
    TableName: table,
    Item: {
      id: uuid.v1(),
      name: data.name,
      email: data.email,
      date: today,
      first_slot: true,
      second_slot: true,
      third_slot: true,
      availability: true,
      createdAt: now,
      updatedAt: now
    }
  }
  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error)
      callback(new Error('Couldn\'t create the todo item.'))
      return
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    }
    callback(null, response)
  })
}

export const appointment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  const data = JSON.parse(event.body)
  const date = data.date ? data.date : today

  let update = 'SET updatedAt = :updatedAt'
  let value = {
    ':updatedAt': now
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

  const params = {
    TableName: table,
    Key: {
      id: event.pathParameters.id,
      date: date
    },
    ExpressionAttributeValues: value,
    UpdateExpression: update,
    ReturnValues: 'ALL_NEW'
  }
  console.log('PARAMS', params)

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.'
      })
      return
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    }
    callback(null, response)
  })
}
