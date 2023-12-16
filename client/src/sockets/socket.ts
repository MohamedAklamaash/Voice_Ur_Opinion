import io from "socket.io-client";

interface socketInterface {
    'force new connection': boolean;
    reconnectionAttempts: number;
    timeout: number;
    transports?: string[];
    autoConnect:boolean;
}

const options: socketInterface = {
    'force new connection': true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    autoConnect:true
};

export const socket = io("http://localhost:8001", options);
