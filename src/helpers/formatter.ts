export const formatResponse = (statusCode: number, response: any): object => {
  return {
    statusCode,
    body: JSON.stringify(response)
  }
}
