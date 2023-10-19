const mongoose = require('mongoose');
const connectdb = require('./db/connect');
const chatModel = require('./Models/Chat');

async function getChat(room){
    try {
        const chatdata = await chatModel.find({ room: room});
        //console.log('user fetched');
        return chatdata;
    } catch (err) {
        console.log(err);
        return null; // or throw an error if you want to handle errors higher up the call stack
    }
}

async function createChat(room,github_id,message){//,date){
    const Chat = {
        github_id: github_id,
        message: "Conversation started!"
      }
    var chatmodel = new chatModel({ room: room,Chat: Chat,llmchat: []});//,date : date});
    chatmodel.save()
    .then(() => console.log('chat data inserted'))
    .catch(err => console.log(err));
}

async function updateChat(room,github_id,message){
    const updateQuery = { room: room}; // Use the _id of the inserted document
    const updateValue = {
      $push: {
        Chat: {
           github_id: github_id,
           message: message
        }
      }
    };
    await chatModel.updateOne(updateQuery, updateValue);
    console.log("Chat updated...");
}

module.exports = { getChat,createChat,updateChat }