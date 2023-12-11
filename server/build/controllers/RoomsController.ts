import { RoomSchema } from "../models/RoomModal"
import { Request, Response } from "express";
import { UserSchema } from "../models/UserDataModel";

//create a room,join a room,owner can update the room details,delete the room
export const joinRoom = async (req:Request,res:Response) => {
    try {
        const {email,userId,roomId} = req.body;
        if(!email||!userId){
            return res.status(404).json({ success: false, msg: "Need data for resource authorization" });
        }
        const roomData = await RoomSchema.findById(roomId);
        if(!roomData){
            return res.status(404).json({success:false,msg:"No such Room exists"});
        }
        const userData = await UserSchema.findOne({email});
        if(!userData){
            return res.status(404).json({success:false,msg:"User doesn't exist"});
        }
        if(!roomData.speakers.includes(userData.name)){
            await roomData.updateOne({$push:{speakers:userData.name}});
            await roomData.save();
            return res.status(201).json({success:true,msg:"User joined Room successfully"});
        }
        else{
            return res.status(301).json({success:false,msg:"User already exists in the Room"});
        }
    } catch (error) {
        console.log("Error in Joining the Room");   
    }
}