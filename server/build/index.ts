import express, { Express } from "express";
import dotenv from "dotenv";
const app: Express = express();
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import otpRoutes from "./routes/Otp_routes";
import { mongoConnection } from "./mongoConnection";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import roomRoutes from "./routes/Room_Routes";
import activationRoutes from './routes/ActivationRoutes';
import { socketActions } from "./actions/SocketActions";

mongoConnection();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});


app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/Otp", otpRoutes);
app.use("/room", roomRoutes);
app.use("/userActivation", activationRoutes);

const socketUserMap = {};

io.on("connection", (socket: Socket) => {
    console.log("User connected", socket.id);
    
    socket.on(socketActions.JOIN, async (data) => {
        const { user, roomId } = data;
        // destructure the user object to access the data from the obj
        socketUserMap[socket.id] = user;
        
        const speakers = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        speakers.forEach((userId) => {
            io.to(userId).emit(socketActions.ADD_PEER, {
                peerId: userId,
                createOffer: false,
                user
            })

            socket.emit(socketActions.ADD_PEER, {
                peerId: userId,
                user,
                createOffer: true
            })
        })
        socket.join(roomId);
        
    })

    socket.on(socketActions.RELAY_ICE, (data) => {
        const { peerId, iceCandidate } = data;
        io.to(peerId).emit(socketActions.ICE_CANDIDATE, {
            peerId: socket.id,
            iceCandidate
        })
    })

    socket.on(socketActions.RELAY_SDP, (data) => {
        const { peerId, sessionDescription } = data;

        io.to(peerId).emit(socketActions.SESSION_DESCRIPTION, {
            sessionDescription,
            peerId: socket.id
        })
    })

    socket.on(socketActions.MUTE, (data) => {
        const { userId, roomId } = data;
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            io.to(clientId).emit(socketActions.MUTE, {
                peerId: socket.id,
                userId
            })
        })
    })

    socket.on(socketActions.UNMUTE, (data) => {
        const { userId, roomId } = data;
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            io.to(clientId).emit(socketActions.UNMUTE, {
                peerId: socket.id,
                userId
            })
        })
    })

    const leaveRoom = () => {
        const { rooms } = socket;
        Array.from(rooms).forEach((roomId) => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => {
                io.to(clientId).emit(socketActions.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMap[socket.id]?._id
                })
            })
            socket.leave(roomId);
        })

        delete socketUserMap[socket.id];
    }

    socket.on(socketActions.LEAVE,leaveRoom);

    socket.on("disconnecting",leaveRoom);

})

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})