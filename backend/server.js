import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {YSocketIO} from "y-socket.io/dist/server";

const app = express();
const httpServer = createServer(app);

// 1. Socket.IO server bound to the same HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// 2. YSocketIO rides on top of that io instance
const ysocketio = new YSocketIO(io, {
    gcEnabled: true
});

// 3. Must be called — it registers the dynamic /yjs|<room> namespace
ysocketio.initialize();

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"Server is running",
        status:true
    })
});


httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});
