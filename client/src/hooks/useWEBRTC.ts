
export const useWebRtc = () => {

    const captureMedia = async () => {
        return navigator.mediaDevices.getUserMedia({
            audio: true
        })
    }

    return { captureMedia }
}