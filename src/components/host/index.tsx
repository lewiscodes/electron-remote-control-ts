import React, { useRef } from 'react';
import Peer from 'simple-peer';
import { startScreenRecord } from './utils';

interface IHostProps {
    readonly ws: SocketIOClient.Socket;
}

const Host = ({ ws }: IHostProps): JSX.Element => {
    const handleCallGuest = async () => {
        const stream = await startScreenRecord();
        console.log(stream);

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });

        peer.on('signal', data => {
            ws.emit('call-guest', data);
        });

        ws.on('call-accepted', (data: any) => {
            peer.signal(data);
        });
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>{`I AM THE HOST - `}</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={handleCallGuest}>Call Guest</button>
                {/* <button style={{ marginLeft: 10 }} onClick={handleStopScreenShare} disabled={!hasHostPeerSignal && !isSharingScreen}>Stop Screen Share</button> */}
            </div>
        </div>
    );
}

export default Host;