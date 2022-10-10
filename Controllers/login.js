const login = (msg)=>{
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
}

module.exports = login;