const express = require('express');
const app = express();
var cors = require('cors');
const { createUser,getUser,updateUser,getUserwid } = require('./Database/Saveuser');
const { createproduct,getproduct ,getproductbyproductid,getproductbyid} = require('./Database/Saveproduct');
const {getComm,createComm, updateComm,updatefeedbackComm,updatetoComm,updateCommtwo,updatepayComm,updateOrderidComm,getCommorder} = require('./Database/Savecomm');
const { getChat,createChat,updateChat } = require('./Database/Savechat')
const { getllmChat,updatellmChat } = require('./Database/Savellmchat')
const { v4: uuidv4 } = require('uuid');
const { Client, Environment, ApiError } = require("square");
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
require('dotenv').config()

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.GOOGLE_AI_API;

const google_client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const client = new Client({
  accessToken: process.env.SQUARE_TOKEN,
  environment: Environment.Sandbox,
});
app.use(express.json())
app.use(cors())

const CLIENT_SECRET =process.env.GITHUB_CLIENT_SECRET ;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;

//chat element running on 8000 port
const { Server } = require("socket.io");

const io = new Server(8000);

const saveMessages = async function(room,message,github_id){
    await updateChat(room,github_id,message)
}

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('join room', (room) => {
      // Join a room named after the user ID or any other identifier
      socket.join(room);
    });
    socket.on('chat message', (data) => {
      const { room, message, githubid } = data;
      console.log(message);
      console.log(githubid);
      //updateChat(room,github_id,message)
      // Send the message to all sockets in the specified room
      io.emit('chat message', message, githubid);
      console.log("aftererer")
      //saveMessages(room,message,github_id);
    });
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
});

app.get('/llmanswer',async function(req,res){
    const chat_message = req.get("message");
    const room = req.get("roomid");
    const product_id = req.get("product_id");
    const github_id = req.get("github_id");
    let product = await getproduct(product_id);
    console.log(product);
    const price = product[0].price/100;
    const product_context = "This is a product description using which you have to answer questions any other questions has to be handled with 'Sorry but the question or request appears out of bounds!'. Data is as follows, price:"+price+" Dollars,description:"+product[0].description+",Name:"+product[0].name;
    //save chat_message first so update
    //await updatellmChat(room,chat_message)
    let messages = [];
    const llmchats = await getllmChat(room)
    let llmchatsnew = llmchats[0].llmchat;
    //const llmchatArray = []
    for (const llmchat of llmchatsnew) {
        const llmchatString = JSON.stringify(llmchat);
        messages.push(JSON.parse(llmchatString));
    }
    messages.push({content: chat_message})
    console.log(messages)
    const result = await google_client.generateMessage({
        model: MODEL_NAME, // Required. The model to use to generate the result.
        temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
        candidateCount: 1, // Optional. The number of candidate results to generate.
        prompt: {
          // optional, preamble context to prime responses
          context: product_context,
          // Optional. Examples for further fine-tuning of responses.(cut out by jay)
          // Required. Alternating prompt/response messages.
          messages: messages ,
        },
      });
      let chat_content = result[0].candidates[0].content;
      //update again
      if(github_id!==room){
      await updatellmChat(room,chat_content)
      }
      //send it in socket 
      //const send_content ={ chatcontent: {github_id : llmchats[0].githubbb_id,content: result[0].candidates[0].content} }
      //res.send(send_content);
      console.log(chat_content)
      if(github_id!==room){
      io.emit("chat message",chat_content,room)
      }
      res.send(chat_content)
})
app.get('/savechats',async function(req,res){
    const github_id = req.get("github_id")
    const room= req.get("roomid")
    const message = req.get("message")
    updateChat(room,github_id,message)
})

app.get('/getchats',async function(req,res){
    console.log("getchts running...")
    const github_id = req.get("github_id")
    const room = req.get("roomid")
    const chats = await getChat(room)
    const chatArray = []
    for (const chat of chats) {
        const chatString = JSON.stringify(chat);
        chatArray.push(JSON.parse(chatString));
    }
    console.log(chatArray)
    res.send(chatArray)
})

app.get('/accessToken', async function (req,res){
    console.log(req.query.code);
    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;// + "&redirect_uri=" + REDIRECT_URL;
    await fetch("https://github.com/login/oauth/access_token" + params,{
        method: "POST",
        headers: {
            "Accept" : "application/json"
        }
    }).then((response)=>{
        //console.log(response);
        return response.json();
    }).then((data)=>{
        //console.log(data);
        res.json(data);
    });
});

app.get('/validateuser',async function (req,res){ 
    req.get("Authorization");
    await fetch("https://api.github.com/user",{
        method: 'GET',
        headers:{
            "Authorization" : req.get("Authorization")
        }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
        res.json(data);
    })
})

app.get('/saveuser', async function(req,res){
    console.log(req.get("token"));
    console.log(req.get("username"));
    req.get("id");
    var userpresence = await getUser(req.get("username"),req.get("id"));
    console.log(userpresence);
    console.log(userpresence.length);
    if(userpresence.length!=0){
        updateUser(userpresence[0].webid,req.get("token"))
    }
    else{
        createUser(req.get("username"),req.get("id"),req.get("token"),uuidv4(),req.get("as"));
    }
})

app.get('/savecomm', async function(req,res){
    var clientuser = await getUserwid(req.get("client_id"));
    console.log(clientuser)
    if(req.get("producturl")===null){const producturl = "null";}else{const producturl = req.get("producturl")}
    if(req.get("chat")===null){const chat = "no";}else{const chat = req.get("chat")}
    if(req.get("completed")===null){const completed = "no";}else{const completed = req.get("completed")}
    if(req.get("pay")===null){const pay = "no";}else{const pay = req.get("pay")}
    if(req.get("order_id")===null){const order_id = "null";}else{const order_id = req.get("order_id")}
    if(req.get("feedback")===null){const feedback = "no";}else{const feedback = req.get("feedback")}
    createComm(req.get("github_username"),clientuser[0].username,req.get("github_id"),req.get("client_id"),req.get("asitem"),producturl,chat,completed,pay,feedback,order_id);
    createComm(clientuser[0].username,req.get("github_username"),req.get("client_id"),req.get("github_id"),req.get("asitem"),producturl,chat,completed,pay,feedback,order_id);
})

app.get('/getcomm',async function(req,res){
    var Comms = await getComm(req.get("github_id"));
    res.send(Comms);
})

app.get('/add',async function(req,res){
    const depricated = "no";
    const newproduct_id = uuidv4();
    const chatproducturi = "localhost:3000/login?as=user&client_id=" + req.get("github_id")+"&chat=yes&product_id=" +newproduct_id;
    const nochatproducturi = "localhost:3000/login?as=user&client_id="+req.get("github_id")+"&chat=no&product_id=" +newproduct_id;
    createproduct(req.get("name"),req.get("price"),req.get("description"),req.get("github_id"),newproduct_id,depricated,chatproducturi,nochatproducturi)
})

app.get('/getadds',async function(req,res){
    var github_id = await getproductbyid(req.get("github_id"));
    res.send(github_id);
})

app.get('/getproductsuri',async function(req,res){
    var producturis= await getproduct(req.get("product_id"));
    console.log(producturis)
    res.send(producturis);
})

app.get('/updatecomm',async function(req,res){
    updateComm(req.get("self"),req.get("product_id"))
    updatetoComm(req.get("to"),req.get("product_id"))
})

app.get('/updateclient',async function(req,res){
    updateCommtwo(req.get('current_chat'),req.get("github_id"));
})

app.get('/updatepay',async function(req,res){
    const github_id = req.get("github_id")
    const current_chat = req.get("current_chat")
    console.log(current_chat)
    updatepayComm(github_id,current_chat)
})

app.get('/getpaylink',async function(req,res){
    const github_id = req.get("github_id")
    const current_chat = req.get("current_chat")
    const product_url = await getComm(github_id)
    console.log(product_url)
    const product_data = await getproduct(product_url[0].producturl)
    console.log(product_data)
    let resp;
    try {
        const response = await client.checkoutApi.createPaymentLink({
          idempotencyKey: uuidv4(),
          order: {
            locationId: 'LGCCTW2S5TMM1',
            lineItems: [
              {
                name: product_data[0].name,
                quantity: '1',
                note: github_id,
                basePriceMoney: {
                  amount: product_data[0].price,
                  currency: 'USD'
                }
              }
            ]
          }
        });
      
        console.log(response.result);
        resp = response.result;
      } catch(error) {
        console.log(error);
      }
      const order_id = resp.paymentLink.orderId;
      console.log(order_id)
      await updateOrderidComm(github_id,current_chat,order_id)
     const paymentlink = resp.paymentLink.url;
      res.send(paymentlink)
})

app.get('/getorderstatus',async function(req,res){
    //changed 1
    if(req.get("github_id")!==null){
    var Comms = await getCommorder(req.get("github_id"),req.get("current_chat"));
    console.log(Comms)
    var state_order;
    const order_id = Comms[0].order_id;
    var resp;
    try {
        const response = await client.ordersApi.retrieveOrder(order_id);
        console.log(response.result);
        resp = response.result;
      } catch(error) {
        console.log(error);
      }
    console.log(resp.order.state)
    state_order = resp.order.state;
    }else{
        state_order = "NOT_CLICKED";
    }
    res.send(state_order);
})

app.get('/sendfeedback',async function(req,res){
    const github_id = req.get("github_id")
    const current_chat = req.get("current_chat")
    const feedback = req.get("feedback")
    updatefeedbackComm(github_id,current_chat,feedback)
})

app.listen(4000,function(){
    console.log("listening to port 4000...")
})