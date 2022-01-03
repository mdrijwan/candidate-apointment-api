export const handler = function (event, context, callback) {
  const token = event.authorizationToken
  const methodArn = event.methodArn
  console.log('EVENT', event)

  switch (token) {
    case 'allow':
      callback(null, generatePolicy('user', 'Allow', methodArn))
      break
    case 'deny':
      callback(null, generatePolicy('user', 'Deny', methodArn))
      break
    case 'unauthorized':
      callback('Unauthorized') // Return a 401 Unauthorized response
      break
    default:
      callback('Error: Invalid token') // Return a 500 Invalid token response
  }

  console.log('POLICY', JSON.stringify(generatePolicy))
}

// Help function to generate an IAM policy
function generatePolicy(principalId, effect, methodArn) {
  const policyDocument = generatePolicyDocument(effect, methodArn)

  return {
    principalId,
    policyDocument,
  }
}

function generatePolicyDocument(effect, methodArn) {
  if (!effect || !methodArn) return null

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn,
      },
    ],
  }

  return policyDocument
}
