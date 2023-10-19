const mongoose = require('mongoose');
const { Schema } = mongoose;

const commSchema = new Schema({
  self: { type: String},
  to: {type: String },
  selfid: { type: String, 
           required: true},
  toid: {type: String,
    required: true},
  as: {type: String},
  producturl: {type: String},
  chat: {type: String},
  completed: {type: String},
  pay: {type: String},
  feedback: {type: String},
  order_id: {type: String},
});

const commModel = mongoose.model('Comm',commSchema)
module.exports = commModel;