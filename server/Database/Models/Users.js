const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String},
  id: {type: String,
       required: true },
  accesst: { type: String, 
           required: true},
  webid: {type: String},
  as: {type: String}
});

const userModel = mongoose.model('User',userSchema)
module.exports = userModel;