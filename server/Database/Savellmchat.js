const mongoose = require('mongoose');
const connectdb = require('./db/connect');
const chatModel = require('./Models/Chat');

async function getllmChat(room){
    try {
        const chatdata = await chatModel.find({ room: room});
        //console.log('user fetched');
        return chatdata;
    } catch (err) {
        console.log(err);
        return null; // or throw an error if you want to handle errors higher up the call stack
    }
}

async function updatellmChat(room,chat_message){
    const updateQuery = { room: room}; // Use the _id of the inserted document
    const updateValue = {
      $push: {
        Chat: {
           github_id: room,
           message: chat_message,
           content: chat_message
        }
      }
    };
    const llmupdateValue = {
        $push: {
          llmchat: {
            content: chat_message
          }
        }
    };
    await chatModel.updateOne(updateQuery, updateValue);
    await chatModel.updateOne(updateQuery, llmupdateValue);
    console.log("Chat updated...");
}

module.exports = { getllmChat,updatellmChat }