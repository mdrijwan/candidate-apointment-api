import { formatResponse } from '../helpers/formatter'
import { getData, queryData } from './../helpers/common'

export const appointment = async event => {
  try {
    const id = event.pathParameters.id
    const date = event.queryStringParameters.date
    const data = await getData(id, date)
    return formatResponse(200, data)
  } catch (error) {
    return formatResponse(400, error)
  }
}

export const availability = async event => {
  try {
    const id = event.pathParameters.id
    const data = await queryData(id)
    return formatResponse(200, data)
  } catch (error) {
    return formatResponse(400, error)
  }
}
