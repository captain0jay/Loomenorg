const mongoose = require('mongoose');
const connectdb = require('./db/connect');
const commModel = require('./Models/Comm');
//require('dotenv').config();

async function getComm(selfid){
    try {
        const commdata = await commModel.find({ selfid: selfid });
        //console.log('user fetched');
        return commdata;
    } catch (err) {
        console.log(err);
        return null; // or throw an error if you want to handle errors higher up the call stack
    }
}

async function getCommorder(selfid,to){
    try {
        const commdata = await commModel.find({ selfid: selfid,to: to });
        //console.log('user fetched');
        return commdata;
    } catch (err) {
        console.log(err);
        return null; // or throw an error if you want to handle errors higher up the call stack
    }
}

async function createComm(self,to,selfid,toid,as,chat,completed,pay,feedback,order_id){//,date){
    var commmodel = new commModel({self: self,to: to,selfid : selfid,toid: toid,as:as,chat:chat,completed:completed,pay:pay,feedback:feedback,order_id:order_id});//,date : date});
    commmodel.save()
    .then(() => console.log('comm data inserted'))
    .catch(err => console.log(err));
}

async function updateComm(self,product_id){
    await commModel.updateOne({ self : self},{$set: { producturl :product_id }});
    console.log("updated communication...");
}

async function updatetoComm(to,product_id){
    await commModel.updateOne({ to : to},{$set: { producturl :product_id }});
    console.log("updated communication...");
}

async function updateCommtwo(self,toid){
    await commModel.updateOne({ self : self},{toid : toid},{$set: { agsent : "yes" }});
    console.log("updated communication...");
}

async function updatepayComm(github_id,current_chat){
    await commModel.updateOne({ toid : github_id,self:current_chat},{$set: { pay :"yes"}});
    await commModel.updateOne({ selfid : github_id,to :current_chat},{$set: { pay :"yes" }});
}

async function updateOrderidComm(github_id,current_chat,order_id){
    await commModel.updateOne({ toid : github_id,self:current_chat},{$set: { order_id : order_id}});
    await commModel.updateOne({ selfid : github_id,to :current_chat},{$set: { order_id : order_id }});
}

async function updatefeedbackComm(github_id,current_chat,feedback){
    await commModel.updateOne({ toid : github_id,self:current_chat},{$set: { feedback : feedback}});
    await commModel.updateOne({ selfid : github_id,to :current_chat},{$set: { feedback : feedback }});
}

module.exports = { getComm,createComm,updateComm,updatetoComm,updateCommtwo,updatepayComm,updateOrderidComm,getCommorder,updatefeedbackComm}