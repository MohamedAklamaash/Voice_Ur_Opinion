class RemoteConnection {
    peer: RTCPeerConnection;

    constructor() {
        const iceServers: RTCIceServer[] = [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" }
        ];

        this.peer = new RTCPeerConnection({ iceServers });
    }

    async setLocalDescription(answer: RTCSessionDescriptionInit) {
        if (this.peer) {
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
        }
    }

    async getAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
        if (this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peer.createAnswer();
            await this.setLocalDescription(answer);
            return answer;
        } else {
            throw new Error("Peer connection is not initialized.");
        }
    }

    async getOffer(): Promise<RTCSessionDescriptionInit> {
        const offer = await this.peer.createOffer();
        await this.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    }
}

export default new RemoteConnection();
