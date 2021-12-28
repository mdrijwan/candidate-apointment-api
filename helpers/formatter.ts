export const formatResponse = (statusCode: number, response: any): any => {
  return {
    statusCode,
    body: JSON.stringify(response)
  }
}
