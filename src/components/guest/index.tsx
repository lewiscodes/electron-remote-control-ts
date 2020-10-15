import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';

interface IGuestProps {
    readonly ws: SocketIOClient.Socket;
}

const Guest = ({ ws }: IGuestProps): JSX.Element => {
    const [receivingCall, setReceivingCall] = useState(false);
    const [callerSignal, setCallerSignal] = useState();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        ws.on('call-received', (data: any) => {
            setReceivingCall(true);
            setCallerSignal(data);
        });
    }, []);

    const handleAcceptCall = () => {
        const peer = new Peer({
            initiator: false,
            trickle: false
        });

        peer.on('signal', data => {
            ws.emit('accept-call', data);
        });

        peer.on('stream', stream => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        });

        peer.signal(callerSignal!);
    }


    return (
        <React.Fragment>
            <div>I AM THE GUEST</div>
            <button disabled={!callerSignal} onClick={handleAcceptCall}>Accept Call</button>
            <video ref={videoRef} autoPlay></video>
        </React.Fragment>
    );
}

export default Guest;