import { getData, formatJSONResponse, queryData } from './../helpers/common'

export const get = async (event, context, callback) => {
  try {
    const id = event.pathParameters.id
    const date = event.queryStringParameters.date
    const table = process.env.TABLE_CANDIDATE
    const data = await getData(id, date, table)
    return formatJSONResponse(200, data)
  } catch (error) {
    return formatJSONResponse(400, error)
  }
}

export const query = async (event, context, callback) => {
  try {
    const id = event.pathParameters.id
    const table = process.env.TABLE_CANDIDATE
    const data = await queryData(id, table)
    return formatJSONResponse(200, data)
  } catch (error) {
    return formatJSONResponse(400, error)
  }
}
