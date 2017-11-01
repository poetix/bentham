'use strict'
const lambdaStage = process.env.ICARUS_STAGE || 'dev'
console.log('Lambda stage: ', lambdaStage)
module.exports = {
  NODE_ENV: '"production"',
  LAMBDA_STAGE: `"${lambdaStage}"`
}