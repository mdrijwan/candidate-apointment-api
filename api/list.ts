import { DynamoDB } from 'aws-sdk'
import { scanData, formatJSONResponse } from '../helpers/common'

const dynamoDb = new DynamoDB.DocumentClient()
const params = {
  TableName: process.env.TABLE_CANDIDATE
}

export const listAll = (event, context, callback) => {
  // fetch all appointments from the database
  // For production workloads you should design your tables and indexes so that your applications can use Query instead of Scan.
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo items.',
        error: error
      })
      return
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    }
    callback(null, response)
  })
}

export const listCandidates = async (event, context, callback) => {
  try {
    const id = event.pathParameters.id
    const table = process.env.TABLE_CANDIDATE
    const data = await scanData(id, table)
    return formatJSONResponse(200, data)
  } catch (error) {
    return formatJSONResponse(400, error)
  }
}
