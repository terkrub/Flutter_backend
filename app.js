const express = require('express')
const http = require('http')
const cors = require('cors')
const scoketIO = require('socket.io')
const mongooose = require('mongoose');
const Schema = mongooose.Schema;
const { isGeneratorObject } = require('util/types');
const User = require('./Model/users');

const app = express()
const server = http.createServer(app);
const io = scoketIO(server)
const PORT = process.env.PORT || 5000;
app.use(express.json())
app.use(cors)

mongooose.connect('mongodb+srv://kryfto:kryfto@kryfto.64xbcbh.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});


server.listen(PORT,()=>{
    console.log("Server run on 5000 port")
})

io.on("connection",(socket)=>{
    console.log("New user connected",socket.id)
    socketid = socket.id
    console.log(socketid)
    socket.join(socketid)

    socket.on("disconnect",()=>{
        console.log("User disconnect")
        socket.leave(socketid)
    })

    socket.on("chat message",(msg)=>{
        msgR = JSON.parse(msg)
        receiverUsername = msgR.receiverUsername
        senderUsername = msgR.senderUsername
        text = msgR.text

        console.log(msgR.receiverUsername)
        io.to(msgR.receiverUsername).emit("chat message",msg)
    })

    socket.on("login",(msg)=>{
        msgR = JSON.parse(msg)

        User.findOne({username: msgR.Username}).then((r)=>{
            if(r != null){
                if(msgR.Password === r.password){
                    Result = {
                        'Username': r.username,
                        'Status': 'Success',
                    }
                    io.to(socketid).emit("login",Result)
                }else{
                    Result = {
                        'Username': r.username,
                        'Status': 'Wrong password',
                    }
                    io.to(socketid).emit("login",Result)
                }
            }else{
                Result = {
                    'Username': msgR.Username,
                    'Status': 'Username Incorrect',
                }
                io.to(socketid).emit("login",Result)
            }
        })

        console.log(msgR)
    })

    socket.on("register",(msg)=>{
        msgR = JSON.parse(msg)

        User.findOne({username: msgR.Username}).then((r)=>{
            if(r === null){
                const user = new User({
                    username: msgR.Username,
                    password: msgR.Password,
                });
                user.save()
            }else{
                Result = {
                    'Username': msgR.Username,
                    'Status': 'user_exists',
                }
                io.to(socketid).emit("login",Result)
                console.log(Result)
            }
        })

        console.log(msgR)
    })
    
    
})