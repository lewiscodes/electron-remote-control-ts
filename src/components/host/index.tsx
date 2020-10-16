import React from 'react';
import Peer from 'simple-peer';
import { startScreenRecord } from './utils';

interface IHostProps {
    readonly ws: SocketIOClient.Socket;
}

export enum EUserInputType {
    Keyboard = 'KEYBOARD',
    MouseMove = 'MOUSE_MOVE',
    MouseClick = 'MOUSE_CLICK'
};

interface IKeyboardEvent {
    readonly key: string;
}

interface IMouseMoveEvent {
    readonly x: number;
    readonly y: number;
}

export interface IUserInput {
    readonly userInputType: EUserInputType;
    readonly event?: IKeyboardEvent | IMouseMoveEvent
}

const Host = ({ ws }: IHostProps): JSX.Element => {
    const handleCallGuest = async () => {
        const stream = await startScreenRecord();

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

        ws.on('host-user-input', (data: IUserInput) => window.ipcRenderer.send('remoteControl', data));
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