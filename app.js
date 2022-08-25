const express = require('express')
const http = require('http')
const cors = require('cors')
const scoketIO = require('socket.io')

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
    console.log("New user connected",socket.id);

    socket.on("chat message",(msg)=>{
        console.log(msg)
        io.emit("chat message",msg)
    })

    socket.on("disconnect",()=>{
        console.log("User disconnect")
    })
    
})