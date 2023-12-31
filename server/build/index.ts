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
import { UserSchema } from "./models/UserDataModel"
import { RoomSchema } from "./models/RoomModal";
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
const sendersPCs = {}
const receiversPC = {};


const isIncluded = (array: User[], id: string) => {
    return array.some((usr) => usr._id === id);
}
interface User {
    name?: string;
    activated?: boolean;
    email?: string;
    phoneNumber?: string;
    userProfileUrl?: string;
    socketId?: string;
    isMuted?: boolean,
    _id?: string;
    owner?: string;
}

io.on("connection", (socket: Socket) => {
    socket.on("connect", () => {
        console.log("User connected", socket.id);
    });

    socket.on(socketActions.ADD_PEER, ({ roomId, users }: { roomId: string; users: User[] }) => {
        socketUserMap[roomId] = users;
    });

    socket.on(socketActions.MUTE, ({ roomId, userId }: { roomId: string; userId: string }) => {
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

        io.to(roomId).emit(socketActions.MUTE_INFO, { users: socketUserMap[roomId] });
        console.log(socketUserMap);

        socket.join(roomId);
    });


    socket.on(socketActions.JOIN, async (data) => {
        try {
            let { roomId, user }: { roomId: string; user: User } = data;

            // Check if the roomId already exists in socketUserMap
            if (!socketUserMap[roomId]) {
                socketUserMap[roomId] = [];
            }

            //When the user joins the room the user should send the offer for stream connection b/w the clients
            // of the application

            if (user?.owner?.length > 0) {
                // If user is the owner of the room, try to find the user in the database
                const foundUser = await UserSchema.findOne({ name: user.owner });

                if (foundUser) {
                    user = foundUser;
                } else {
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
            io.to(roomId).emit(socketActions.JOIN, { user });

            // Join the socket room for the specified roomId
            socket.join(roomId);

            // Emit the JOIN event to the current user
            // socket.to(socket.id).emit(socketActions.JOIN, { user });
        } catch (error) {
            console.error('Error in JOIN event:', error);
        }
    });

    socket.on(socketActions.LEAVE, ({ user, roomId }: { user: User; roomId: string }) => {
        try {

            socketUserMap[roomId] = socketUserMap[roomId].filter((data) => data.email !== user.email);

            // Emit the LEAVE event to all users in the roomId
            io.to(roomId).emit(socketActions.LEAVE, { users: socketUserMap[roomId] });

            // Emit the LEAVE event to the current user
            // socket.to(socket.id).emit(socketActions.LEAVE, { users: socketUserMap });
            console.log(user.name + ":Left the Room");
        } catch (error) {
            console.log(error);

        }
    });

    socket.on(socketActions.RELAY_ICE, ({ iceCandidate, roomId, peerId }: { iceCandidate: string, roomId: string, peerId: string }) => {
        console.log("Relay ice event called!");

        io.to(roomId).emit(socketActions.ICE_CANDIDATE, {
            peerId,
            iceCandidate,
        })
        console.log("IceCandidate:", iceCandidate);
    })

    socket.on(socketActions.RELAY_SDP, ({ sessionDescription, roomId, peerId }: { sessionDescription: string, roomId: string, peerId: string }) => {
        console.log("Session description event called ");

        io.to(roomId).emit(socketActions.SESSION_DESCRIPTION, {
            sessionDescription,
            peerId
        })
        //peer id is the person's id that the user what to request a streaming with
    })

    socket.on(socketActions.REMOVE_PEER, async ({ peerId, userName, roomId }: { peerId: string, userName: String, roomId: string }) => {
        const data = await RoomSchema.findById(roomId);
        if (data?.owner === userName) {
            socketUserMap[roomId] = socketUserMap[roomId].filter((usr) => usr._id !== peerId);
            io.to(roomId).emit(socketActions.REMOVE_PEER, { users: socketUserMap[roomId] });
        } else {
            console.log("Only users can remove the users in the room!");
        }
    })

    socket.on("disconnect", () => {
        console.log("User disconnected!");
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
