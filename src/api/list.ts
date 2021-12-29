import { formatResponse } from '../helpers/formatter'
import { scanData, scanTable } from '../helpers/common'

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
