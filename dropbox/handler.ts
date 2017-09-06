export const webhookChallenge = (event, context, cb) => {
  console.log(event)

  cb(null,
    {
      statusCode: 200,
      body: event.query.challenge
    })
}

export const webhookNotify = (event, context, cb) => cb(null,
  processNotification(JSON.parse(event.body))
)

function processNotification(notification) {
    console.log(notification)
    return {
      statusCode: 200
    }
}
