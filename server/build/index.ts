import express, { Express } from "express";
import dotenv from "dotenv";
const app: Express = express();
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import otpRoutes from "./routes/Otp_routes";
import { mongoConnection } from "./mongoConnection";
import roomRoutes from "./routes/Room_Routes";
import activationRoutes from './routes/ActivationRoutes';
mongoConnection();
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/Otp", otpRoutes);
app.use("/room",roomRoutes);
app.use("/userActivation",activationRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})