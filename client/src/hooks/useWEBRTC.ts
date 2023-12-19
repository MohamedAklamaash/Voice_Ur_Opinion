import freeice from "freeice";
import { socket } from "../sockets/socket";
import { useState,useRef } from "react";

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


    function muteClient(instance:HTMLAudioElement,clientId:string){
        
    }

    async function provideRef({audioInstance,clientId}:{audioInstance:HTMLAudioElement,clientId:string}) {
        audioElements.current[clientId] = audioInstance;
    }

    return {capturemedia,muteClient,provideRef};
}
