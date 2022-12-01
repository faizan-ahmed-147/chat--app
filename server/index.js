const http=require("http");
const express =require("express");
const cors = require("cors");
const socketIO = require("socket.io");


const app=express();
const port= process.env.PORT || 5000 ;


const users=[{}];

app.use(cors());

const server=http.createServer(app);

const io=socketIO(server);


app.use(express.static(path.join(__dirname, "./chat/build")));

app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./chat/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

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