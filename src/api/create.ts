import * as uuid from 'uuid'
import { formatResponse } from '../helpers/formatter'
import { createData, updateData } from '../helpers/common'

const today = new Date().toISOString().slice(0, 10)
const now = new Date().getTime()

export const candidate = async (event) => {
  const data = JSON.parse(event.body)
  try {
    const item = {
      id: uuid.v4(),
      name: data.name,
      email: data.email,
      date: today,
      first_slot: 'available',
      second_slot: 'available',
      third_slot: 'available',
      availability: 'yes',
      createdAt: now,
      updatedAt: now
    }
    const candidateData = await createData(item)
    return formatResponse(200, candidateData)
  } catch (error) {
    return formatResponse(400, error)
  }
}

export const appointment = async (event) => {
  try {
    const id = event.pathParameters.id
    const data = JSON.parse(event.body)
    const appointmentData = await updateData(id, data)
    return formatResponse(200, appointmentData)
  } catch (error) {
    return formatResponse(400, error)
  }
}
