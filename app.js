const express = require('express')
const http = require('http')
const cors = require('cors')
const scoketIO = require('socket.io')
const { isGeneratorObject } = require('util/types')

const app = express()
const server = http.createServer(app);
const io = scoketIO(server)
const PORT = 5000;
app.use(express.json())
app.use(cors)

server.listen(PORT,()=>{
    console.log("Server run on 5000 port")
})

io.on("connection",(socket)=>{
    console.log("New user connected",socket.id)
    chatID = socket.handshake.query.chatID
    console.log(chatID)
    socket.join(chatID)

    socket.on("disconnect",()=>{
        console.log("User disconnect")
        socket.leave(chatID)
    })

    socket.on("chat message",(msg)=>{
        msgR = JSON.parse(msg)
        receiverUsername = msgR.receiverUsername
        senderUsername = msgR.senderUsername
        text = msgR.text

        console.log(msgR.receiverUsername)
        io.to(msgR.receiverUsername).emit("chat message",msg)
    })

    
    
})