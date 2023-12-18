import freeice from "freeice";
import { socket } from "../sockets/socket";
import { useState,useRef } from "react";

export const useWEBRTC = async()=>{
    const localMediaStream = useRef({});
    const socketMedia = useRef({});
    
    async function capturemedia() {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
            audio:true
        })
        console.log(localMediaStream.current);
    }

    async function chatInit(){
        const localSocket = socket;
        
    }

    function muteClient(instance:HTMLAudioElement,clientId:string){

    }

    return {capturemedia};
}
