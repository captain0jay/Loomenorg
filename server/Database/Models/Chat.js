const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  room: {type: String},
  Chat: {type: Array},
  llmchat: {type: Array}
});

const chatModel = mongoose.model('Chat',chatSchema)
module.exports = chatModel;