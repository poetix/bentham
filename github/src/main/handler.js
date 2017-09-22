// Lambda handlers
'use strict';

const api = require('./app').api;

// Submit Event
module.exports.receiveWebhookEvent = (event, context, callback) => api.receiveWebhookEvent(event, callback);
