import { formatResponse } from '../helpers/formatter'
import { queryAvailability, queryDate, scanData, scanTable } from '../helpers/common'

export const candidates = async () => {
  try {
    const candidatesData = await scanTable()
    console.log('DATA', candidatesData)
    return formatResponse(200, candidatesData)
  } catch (error) {
    console.log('ERROR', error)
    return formatResponse(400, error)
  }
}

export const appointments = async (event) => {
  try {
    const id = event.pathParameters.id
    const appointmentsData = await scanData(id)
    console.log('DATA', appointmentsData)
    return formatResponse(200, appointmentsData)
  } catch (error) {
    console.log('ERROR', error)
    return formatResponse(400, error)
  }
}

export const availability = async (event) => {
  try {
    const date = event.queryStringParameters ? event.queryStringParameters.date : null
    const availabilityData = date != null ? await queryDate(date) : await queryAvailability()
    console.log('DATA', availabilityData)
    return formatResponse(200, availabilityData)
  } catch (error) {
    console.log('ERROR', error)
    return formatResponse(400, error)
  }
}