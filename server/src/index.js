"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const Otp_routes_1 = __importDefault(require("./routes/Otp_routes"));
const mongoConnection_1 = require("./mongoConnection");
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const Room_Routes_1 = __importDefault(require("./routes/Room_Routes"));
const ActivationRoutes_1 = __importDefault(require("./routes/ActivationRoutes"));
const SocketActions_1 = require("./actions/SocketActions");
const UserDataModel_1 = require("./models/UserDataModel");
const RoomModal_1 = require("./models/RoomModal");
(0, mongoConnection_1.mongoConnection)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//routes
app.use("/Otp", Otp_routes_1.default);
app.use("/room", Room_Routes_1.default);
app.use("/userActivation", ActivationRoutes_1.default);
const socketUserMap = {};
const sendersPCs = {};
const receiversPC = {};
const isIncluded = (array, id) => {
    return array.some((usr) => usr._id === id);
};
io.on("connection", (socket) => {
    socket.on("connect", () => {
        console.log("User connected", socket.id);
    });
    socket.on(SocketActions_1.socketActions.ADD_PEER, ({ roomId, users }) => {
        socketUserMap[roomId] = users;
    });
    socket.on(SocketActions_1.socketActions.MUTE, ({ roomId, userId }) => {
        // Check if the roomId already exists in socketUserMap
        if (!socketUserMap[roomId]) {
            socketUserMap[roomId] = [];
        }
        socketUserMap[roomId] = socketUserMap[roomId].map(user => {
            if (user._id === userId) {
                user.isMuted = !user.isMuted;
            }
            return user;
        });
        io.to(roomId).emit(SocketActions_1.socketActions.MUTE_INFO, { users: socketUserMap[roomId] });
        console.log(socketUserMap);
        socket.join(roomId);
    });
    socket.on(SocketActions_1.socketActions.JOIN, async (data) => {
        try {
            let { roomId, user } = data;
            // Check if the roomId already exists in socketUserMap
            if (!socketUserMap[roomId]) {
                socketUserMap[roomId] = [];
            }
            //When the user joins the room the user should send the offer for stream connection b/w the clients
            // of the application
            if (user?.owner?.length > 0) {
                // If user is the owner of the room, try to find the user in the database
                const foundUser = await UserDataModel_1.UserSchema.findOne({ name: user.owner });
                if (foundUser) {
                    user = foundUser;
                }
                else {
                    console.error(`User not found for email: ${user.email}`);
                    return; // Stop further execution
                }
            }
            user["isMuted"] = false;
            user["socketId"] = socket.id;
            // if socket id is present in the object then the user is active
            // socketUserMap[roomId].forEach((usr: User, index: number) => {
            //     io.to(user.socketId).emit()
            // });
            socketUserMap[roomId].push(user);
            // Emit the JOIN event to all users in the roomId
            io.to(roomId).emit(SocketActions_1.socketActions.JOIN, { user });
            // Join the socket room for the specified roomId
            socket.join(roomId);
            // Emit the JOIN event to the current user
            // socket.to(socket.id).emit(socketActions.JOIN, { user });
        }
        catch (error) {
            console.error('Error in JOIN event:', error);
        }
    });
    socket.on(SocketActions_1.socketActions.LEAVE, ({ user, roomId }) => {
        try {
            socketUserMap[roomId] = socketUserMap[roomId].filter((data) => data.email !== user.email);
            // Emit the LEAVE event to all users in the roomId
            io.to(roomId).emit(SocketActions_1.socketActions.LEAVE, { users: socketUserMap[roomId] });
            // Emit the LEAVE event to the current user
            // socket.to(socket.id).emit(socketActions.LEAVE, { users: socketUserMap });
            console.log(user.name + ":Left the Room");
        }
        catch (error) {
            console.log(error);
        }
    });
    socket.on(SocketActions_1.socketActions.RELAY_ICE, ({ iceCandidate, roomId, peerId }) => {
        console.log("Relay ice event called!");
        io.to(roomId).emit(SocketActions_1.socketActions.ICE_CANDIDATE, {
            peerId,
            iceCandidate,
        });
        console.log("IceCandidate:", iceCandidate);
    });
    socket.on(SocketActions_1.socketActions.RELAY_SDP, ({ sessionDescription, roomId, peerId }) => {
        console.log("Session description event called ");
        io.to(roomId).emit(SocketActions_1.socketActions.SESSION_DESCRIPTION, {
            sessionDescription,
            peerId
        });
        //peer id is the person's id that the user what to request a streaming with
    });
    socket.on(SocketActions_1.socketActions.REMOVE_PEER, async ({ peerId, userName, roomId }) => {
        const data = await RoomModal_1.RoomSchema.findById(roomId);
        if (data?.owner === userName) {
            socketUserMap[roomId] = socketUserMap[roomId].filter((usr) => usr._id !== peerId);
            io.to(roomId).emit(SocketActions_1.socketActions.REMOVE_PEER, { users: socketUserMap[roomId] });
        }
        else {
            console.log("Only users can remove the users in the room!");
        }
    });
    socket.on("disconnect", () => {
        console.log("User disconnected!");
    });
});
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
