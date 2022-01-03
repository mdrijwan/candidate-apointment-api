export const formatResponse = (statusCode: number, response) => {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response, null, '\t'),
  }
}
