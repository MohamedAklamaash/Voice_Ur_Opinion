import mongoose from "mongoose";

export const mongoConnection = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@voice-your-opinion.cgd6dgo.mongodb.net/Voive-Your-Opinion?retryWrites=true&w=majority`).then(() => {
        console.log("Mongo DB is connected successfully!");
    }).catch((err) => {
        console.log("Error in connecting to Mongo DB");
    })
}