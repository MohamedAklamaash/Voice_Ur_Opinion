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

const socketUserMap: Record<string, User[]> = {};

interface User {
    name?: string;
    activated?: boolean;
    email?: string;
    phoneNumber?: string;
    userProfileUrl?: string;
}

io.on("connection", (socket: Socket) => {
    socket.on("connect", () => {
        console.log("User connected", socket.id);
    });

    socket.on(socketActions.JOIN, (data) => {
        const { roomId, user }: { roomId: string; user: User } = data;

        // Check if the roomId already exists in socketUserMap
        if (!socketUserMap[roomId]) {
            socketUserMap[roomId] = [];
        }

        // Add the user to the array for the specified roomId
        socketUserMap[roomId].push(user);

        // Emit the JOIN event to all users in the roomId
        io.to(roomId).emit(socketActions.JOIN, { user });

        // Join the socket room for the specified roomId
        socket.join(roomId);

        // Emit the JOIN event to the current user
        socket.to(socket.id).emit(socketActions.JOIN, { user });

    });
    socket.on(socketActions.LEAVE, ({ user, roomId }: { user: User; roomId: string }) => {
        // Use the filter method correctly and update socketUserMap[roomId]
        socketUserMap[roomId] = socketUserMap[roomId].filter((data) => data.email !== user.email);

        // Emit the LEAVE event to all users in the roomId
        io.to(roomId).emit(socketActions.LEAVE, { users: socketUserMap });

        // Join the socket room for the specified roomId (is this intentional?)
        socket.join(roomId);

        // Emit the LEAVE event to the current user
        socket.to(socket.id).emit(socketActions.LEAVE, { users: socketUserMap });
        console.log(user.name + ":Left the Room");
    });


    socket.on("disconnect", () => {
        console.log("User disconnected!");
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
