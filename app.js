import express from "express";
import { fileURLToPath } from 'url'; 
import path from 'path';
import {Server} from "socket.io";
const app = express();
app.set('port', process.env.PORT || 3000);

const __filename = fileURLToPath(import.meta.url);//getting the file path from url
const __dirname = path.dirname(__filename);//getting the directory path from the file path
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine", "ejs");
app.get('/', (req, res) => {
    res.render('index');
});
const server = app.listen(app.get('port'), () => {
  console.log(`Server is listening on port ${app.get('port')}`);
});
const io = new Server(server,{
    cors:"*"
})
io.on('connection',(socket)=>{
    //when user is connected
    console.log(`user ${socket.id} is connnected`);
    socket.on('send-Location',(data)=>{
        console.log(data);//obtaining the location of the user
        io.emit('receive-Location',{id:socket.id, ...data});
        })

    socket.on('disconnect',()=>{
        //when user is disconnected
        console.log(`user ${socket.id} is disconnected`);
        io.emit('user-disconnected',socket.id);
   
    })
})
