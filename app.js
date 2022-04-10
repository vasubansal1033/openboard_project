const express = require('express');
const socket = require('socket.io');

const app = express();

app.use(express.static("public"));

let port =process.env.PORT || 3000;
let server = app.listen(port, (e) => {
    console.log(`Listening on port ${port}`);
})

let io = socket(server);
io.on("connection", (socket) => {
    console.log("Made socket connection");

    // receive data from frontend
    socket.on("beginPath", (data) => {
        // transfer to all clients
        io.sockets.emit("beginPath", data);
    })
    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })
    socket.on("redoUndo", (data)=>{
        io.sockets.emit("redoUndo", data);
    })
})
