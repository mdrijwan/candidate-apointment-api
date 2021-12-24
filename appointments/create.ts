import * as uuid from 'uuid'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

export const create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  let availability = true
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)
  const date = data.date.split('-')
  const newDate = new Date(date[2], date[1] - 1, date[0])

  if (!data.first_slot && !data.second_slot && !data.third_slot) {
    availability = false
  }

  const params = {
    TableName: process.env.TABLE_CANDIDATE,
    Item: {
      id: uuid.v1(),
      name: data.name,
      email: data.email,
      date: newDate.getTime(),
      first_slot: data.first_slot,
      second_slot: data.second_slot,
      third_slot: data.third_slot,
      availability: availability,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }
  // write the todo to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(new Error('Couldn\'t create the todo item.'))
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    }
    callback(null, response)
  })
}
