import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

export const update = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)

  const params = {
    TableName: process.env.TABLE_CANDIDATE,
    Key: {
      id: event.pathParameters.id,
      date: event.pathParameters.date
    },
    ExpressionAttributeValues: {
      ':first_slot': data.first_slot,
      ':second_slot': data.second_slot,
      ':third_slot': data.third_slot,
      ':updatedAt': timestamp
    },
    UpdateExpression: 'SET first_slot = :first_slot, second_slot = :second_slot, third_slot = :third_slot, updatedAt = :updatedAt',
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