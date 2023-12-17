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

mongoConnection();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on("connection", (socket: Socket) => {
    console.log("User connected",socket.id);
    
    socket.on("joinedUser", async (data) => {
        const { userName, email } = data;
        let checker: string = "userJoined";
        socket.emit("userJoined", checker)
    })
})

app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/Otp", otpRoutes);
app.use("/room", roomRoutes);
app.use("/userActivation", activationRoutes);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})