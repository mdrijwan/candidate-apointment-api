import * as uuid from 'uuid'
import { createData, formatJSONResponse, updateData } from '../helpers/common'

const table = process.env.TABLE_CANDIDATE
const today = new Date().toISOString().slice(0, 10)
const now = new Date().getTime()

export const candidate = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  try {
    const item = {
      id: uuid.v4(),
      date: today,
      first_slot: 'available',
      second_slot: 'available',
      third_slot: 'available',
      availability: 'yes',
      createdAt: now,
      updatedAt: now
    }
    const candidateData = await createData(item, table)
    return formatJSONResponse(200, candidateData)
  } catch (error) {
    return formatJSONResponse(400, error)
  }
}

export const appointment = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  try {
    const id = event.pathParameters.id
    const data = JSON.parse(event.body)
    const appointmentData = await updateData(id, data, table)
    return formatJSONResponse(200, appointmentData)
  } catch (error) {
    return formatJSONResponse(400, error)
  }
}
