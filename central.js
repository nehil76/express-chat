const express = require('express');
const app = express();
const http = require('http');
const { instrument } = require("@socket.io/admin-ui");

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server ,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }});

  instrument(io, {
    auth: false
  });
  
const config = require('./config/config.json');

var hostSocketMapping = {};


io.on('connection', (socket) => {
  socket.emit("loggedinParticipant",hostSocketMapping);
  let hostname = socket.handshake.query.hostname;
  if(hostname){
    let userDetails = {hostname,id:socket.id};
    hostSocketMapping[hostname]=socket.id;
    socket.broadcast.emit("participantin",userDetails);
    console.log('User connected: '+hostname);
  }
  
  socket.on("disconnect",(arg)=>{
    console.log('User disconnected: '+socket.handshake.query.hostname);
    socket.broadcast.emit("participantout",{hostname :socket.handshake.query.hostname});
    delete hostSocketMapping[socket.handshake.query.hostname];
});

  socket.on("privatechat",(arg)=>{
    arg['senderHostName'] =  socket.handshake.query.hostname;
    arg['timestamp'] = new Date();
    let recieverSocketId = hostSocketMapping[arg.hostname];
    io.to(recieverSocketId).emit("privatechat",arg);
  });

  socket.on("typing",(arg)=>{
    let recieverSocketId = hostSocketMapping[arg.reciever];
    io.to(recieverSocketId).emit("typing",arg);
  });

});

 
server.listen(config.central.port, () => {
    console.log('Central. machine server started on port '+config.central.port);
});