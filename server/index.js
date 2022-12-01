const http=require("http");
const express =require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const path = require("path");


const app=express();
const port= process.env.PORT || 5000 ;


const users=[{}];

app.use(cors());

const server=http.createServer(app);

const io=socketIO(server);




if ( process.env.NODE_ENV == "production"){

  app.use(express.static("chat/build"));

  const path = require("path");

  app.get("*", (req, res) => {

      res.sendFile(path.resolve(__dirname, 'chat', 'build', 'index.html'));

  })


}

io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on('joined',({user})=>{
          users[socket.id]=user;
          console.log(`${user} has joined `);
          socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
          socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconnect',()=>{
          socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        console.log(`user left`);
    })
});


server.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})