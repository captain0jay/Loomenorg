const mongoose = require('mongoose');
const connectdb = require('./db/connect');
const productModel = require('./Models/Product');
//var productModel = mongoose.model('user')

async function createproduct(name,price,description,github_id,product_id,depricated,chatproducturi,nochatproducturi){//,date){
    var productmodel = new productModel({name: name,price: price,description: description,github_id: github_id,product_id:product_id,depricated:depricated,chatproducturi:chatproducturi,nochatproducturi:nochatproducturi});//,date : date});
    productmodel.save()
    .then(() => console.log('product inserted'))
    .catch(err => console.log(err));
}

async function getproduct(product_id){
    try {
        const productdata = await productModel.find({ product_id: product_id });
        //console.log('user fetched');
        return productdata;
    } catch (err) {
        console.log(err);
        return null; // or throw an error if you want to handle errors higher up the call stack
    }
}

async function getproductbyid(github_id){
    try {
        const productdata = await productModel.find({ github_id: github_id });
        //console.log('user fetched');
        return productdata;
    } catch (err) {
        console.log(err);
        return null; // or throw an error if you want to handle errors higher up the call stack
    }
}

module.exports = {createproduct,getproduct,getproductbyid}