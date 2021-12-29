import { formatResponse } from '../helpers/formatter'
import { getData, queryData } from './../helpers/common'

export const appointment = async event => {
  try {
    const id = event.pathParameters.id
    const date = event.queryStringParameters.date
    const appointmentData = await getData(id, date)
    console.log('DATA', appointmentData)
    return formatResponse(200, appointmentData)
  } catch (error) {
    console.log('ERROR', error)
    return formatResponse(400, error)
  }
}

export const availability = async event => {
  try {
    const id = event.pathParameters.id
    const availabilityData = await queryData(id)
    console.log('DATA', availabilityData)
    return formatResponse(200, availabilityData)
  } catch (error) {
    console.log('ERROR', error)
    return formatResponse(400, error)
  }
}
