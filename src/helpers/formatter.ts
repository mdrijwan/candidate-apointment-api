export const formatResponse = (statusCode: number, response) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  }
}
