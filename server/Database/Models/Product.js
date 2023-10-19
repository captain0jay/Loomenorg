const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String},
  price: {type: Number},
  description: {type: String},
  github_id: {type: String},
  product_id: {type: String},
  depricated: {type: String},
  chatproducturi: {type: String},
  nochatproducturi: {type: String},
});

const productModel = mongoose.model('Product',productSchema)
module.exports = productModel;