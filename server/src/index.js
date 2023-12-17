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
(0, mongoConnection_1.mongoConnection)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    socket.on("joinedUser", async (data) => {
        const { userName, email } = data;
        let checker = "userJoined";
        socket.emit("userJoined", checker);
    });
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
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
