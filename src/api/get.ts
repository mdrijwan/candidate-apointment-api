import { formatResponse } from '../helpers/formatter'
import { getData, queryData } from './../helpers/common'

export const appointment = async event => {
  try {
    const id = event.pathParameters.id
    if (!event.queryStringParameters) {
      throw new Error('Missing required property: date')
    }
    const date = event.queryStringParameters.date
    const appointmentData = await getData(id, date)
    if (!appointmentData) {
      throw new Error('No data found')
    }
    console.log('DATA', appointmentData)
    return formatResponse(200, appointmentData)
  } catch (error) {
    console.error(error)
    return formatResponse(400, error.message)
  }
}

export const availability = async event => {
  try {
    const id = event.pathParameters.id
    const availabilityData = await queryData(id)
    if (availabilityData.length === 0) {
      throw new Error('No data found')
    }
    console.log('DATA', availabilityData)
    return formatResponse(200, availabilityData)
  } catch (error) {
    console.error(error)
    return formatResponse(400, error.message)
  }
}
