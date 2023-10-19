const mongoose = require('mongoose');
const connectdb = require('./db/connect');
const userModel = require('./Models/Users');
require('dotenv').config();
const uri = process.env.MONGO_URI;
connectdb(uri);


async function getUser(username,id){
    try {
        const userdata = await userModel.find({ username: username, id: id });
        //console.log('user fetched');
        return userdata;
    } catch (err) {
        console.log(err);
        return null; // or throw an error if you want to handle errors higher up the call stack
    }
}

async function getUserwid(id){
    try {
        const userdata = await userModel.find({ id: id });
        //console.log('user fetched');
        return userdata;
    } catch (err) {
        console.log(err);
        return null; // or throw an error if you want to handle errors higher up the call stack
    }
}

async function createUser(username,id,accesst,webid,as){//,date){
    var usermodel = new userModel({username: username,id: id,accesst : accesst,webid: webid,as:as});//,date : date});
    usermodel.save()
    .then(() => console.log('user data inserted'))
    .catch(err => console.log(err));
}

async function updateUser(webid,accesst){
    await userModel.updateOne({ webid : webid},{$set: { accesst : accesst}});
    console.log("updated accesst...");
}

module.exports = { getUser,createUser,updateUser,getUserwid }