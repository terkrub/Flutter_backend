const express = require('express')
const http = require('http')
const cors = require('cors')
const scoketIO = require('socket.io')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isGeneratorObject } = require('util/types');
const User = require('./Model/users');
const Rooms = require('./Model/roomInfo');
const Players = require('./Model/players');

const app = express()
const server = http.createServer(app);
const io = scoketIO(server)
const PORT = process.env.PORT || 5000;
app.use(express.json())
app.use(cors)

mongoose.connect('mongodb+srv://kryfto:kryfto@kryfto.64xbcbh.mongodb.net/Userinfo?retryWrites=true&w=majority', {useNewUrlParser: true});

server.listen(PORT,()=>{
    console.log("Server run on 5000 port")
})

io.on("connection",(socket)=>{
    console.log("New user connected",socket.id)
    socketid = socket.id
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
    
    socket.on("create room",(msg)=>{
        msgR = JSON.parse(msg)

        const result = Math.random().toString(36).substring(2,7);
        Rooms.findOne({Code: result.toUpperCase()}).then(async (r)=>{
            if(r === null){
                const room = new Rooms({
                    Code: result.toUpperCase(),
                    MaxSeeker: 2,
                    maxHider: 5,
                });
                room.save()

                const player = new Players({
                    Code: room.Code,
                    Username: "terkrub",
                    Role: false
                })

                player.save()

                Result = {
                    'Status': 'Success',
                }

                socket.join(room.Code)

                io.to(room.Code).emit("create room",Result)
                

            }
            else{
                Result = {
                    'Status': 'Fail',
                }
                io.to(socketid).emit("create room",Result)
            }
        })

    })

    socket.on("join room",(msg)=>{
        msgR = JSON.parse(msg)

        Rooms.findOne({Code: msgR.Code}).then(async (r)=>{
            if(r !== null){
                Players.findOne({Code: msgR.Code,Username: msgR.Username}).then(async (r)=>{
                    if(r === null){

                        const player = new Players({
                            Code: msgR.Code,
                            Username: msgR.Username,
                            Role: msgR.Role
                        })
                    
                        player.save()
                    
                        Result = {
                            'Status': 'Success',
                            'Username': msgR.Username,
                            'Role': msgR.Role
                        }
                        socket.join(msgR.Code)
                    
                        io.to(msgR.Code).emit("new join",Result)
                        console.log(Result)

                        const playeritems = await Players.find({Code: msgR.Code})
                        io.to(socketid).emit("join room",playeritems)
                    
                    }
                    else{
                        Result = {
                            'Status': 'Fail',
                        }
                        io.to(socketid).emit("join room",Result)
                    }
                })
                

            }
            else{
                Result = {
                    'Status': 'Fail',
                }
                io.to(socketid).emit("new join",Result)
            }
        })

    })
    socket.on("change role",(msg)=>{
        msgR = JSON.parse(msg)

        Players.findOne({Code: msgR.Code,Username: msgR.Username}).then((r)=>{
            if(r !== null){
                console.log(msgR)
                r.updateOne({Role: msgR.Role})
                io.to(msgR.Code).emit("change role",msg)
            }
        })
    })
})


