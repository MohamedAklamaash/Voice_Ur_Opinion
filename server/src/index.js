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
        console.log(socketUserMap);
        console.log(roomId, userId);
        // Use map instead of filter to create a new array with updated mute status
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
        let { roomId, user } = data;
        // Check if the roomId already exists in socketUserMap
        if (!socketUserMap[roomId]) {
            socketUserMap[roomId] = [];
        }
        user["isMuted"] = false;
        // if(user?.owner!==""){
        //     user = await UserSchema.findById(user._id);
        // }
        socketUserMap[roomId].push(user);
        console.log(socketUserMap);
        // Emit the JOIN event to all users in the roomId
        io.to(roomId).emit(SocketActions_1.socketActions.JOIN, { user });
        // Join the socket room for the specified roomId
        socket.join(roomId);
        // Emit the JOIN event to the current user
        // socket.to(socket.id).emit(socketActions.JOIN, { user });
    });
    socket.on(SocketActions_1.socketActions.LEAVE, ({ user, roomId }) => {
        try {
            // Use the filter method correctly and update socketUserMap[roomId]
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
    socket.on("disconnect", () => {
        console.log("User disconnected!");
    });
});
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
