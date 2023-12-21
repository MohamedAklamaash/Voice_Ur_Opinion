import freeice from "freeice";
import { socket } from "../sockets/socket";
import { useState,useRef } from "react";
import { socketActions } from "../constants/Actions";

// This component holds all the logic w.r.t sockets from muting to unmuting and relying audio across devices

export const useWEBRTC = ()=>{
    const localMediaStream = useRef({});

    const audioElements = useRef({});
    
    async function capturemedia() {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
            audio:true
        })        
        return localMediaStream.current;
    }


    function muteClient(instance:HTMLAudioElement,clientId:string,roomId:string){
        socket.emit(socketActions.MUTE,{
            userId:clientId,
            roomId
        })
    }

    function relayIceCandidate({peerId}) {
        //need to create a ice candidate and send it in the socket to another user
        socket.emit(socketActions.RELAY_ICE,{
            peerId,
            iceCandidate:freeice()
        })
    }

    async function provideRef({audioInstance,clientId}:{audioInstance:HTMLAudioElement,clientId:string}) {
        audioElements.current[clientId] = audioInstance;
    }

    return {capturemedia,muteClient,provideRef};
}
