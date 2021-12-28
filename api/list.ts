import { formatResponse } from '../helpers/formatter'
import { scanData, scanTable } from '../helpers/common'

export const candidates = async () => {
  try {
    const data = await scanTable()
    return formatResponse(200, data)
  } catch (error) {
    return formatResponse(400, error)
  }
}

export const appointments = async (event) => {
  try {
    const id = event.pathParameters.id
    const data = await scanData(id)
    return formatResponse(200, data)
  } catch (error) {
    return formatResponse(400, error)
  }
}
