const express = require('express')
const http = require('http')
const cors = require('cors')
const scoketIO = require('socket.io')
const mongooose = require('mongoose');
const Schema = mongooose.Schema;
const { isGeneratorObject } = require('util/types')

const app = express()
const server = http.createServer(app);
const io = scoketIO(server)
const PORT = 5000;
app.use(express.json())
app.use(cors)

mongooose.connect('mongodb+srv://kryfto:kryfto@kryfto.64xbcbh.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {timestamps: false})

const User = mongooose.model('users', userSchema);
module.exports = User;

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

    socket.on("login",(msg)=>{
        msgR = JSON.parse(msg)

        User.findOne({username: msgR.Username}).then((r)=>{
            if(r != null){
                if(msgR.Password === r.password){
                    Result = {
                        'Username': r.username,
                        'Status': 'Success',
                    }
                    io.emit("login",Result)
                }else{
                    Result = {
                        'Username': r.username,
                        'Status': 'Wrong password',
                    }
                    io.emit("login",Result)
                }
            }else{
                Result = {
                    'Username': msgR.Username,
                    'Status': 'Username Incorrect',
                }
                io.emit("login",Result)
            }
        })

        console.log(msgR)
    })

    
    
})