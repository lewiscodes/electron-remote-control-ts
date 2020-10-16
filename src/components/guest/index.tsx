import React, { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'simple-peer';

interface IGuestProps {
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

const Guest = ({ ws }: IGuestProps): JSX.Element => {
    const [receivingCall, setReceivingCall] = useState(false);
    const [callerSignal, setCallerSignal] = useState();
    const [localPeer, setLocalPeer] = useState<Peer.Instance>();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        ws.on('call-received', (data: any) => {
            setReceivingCall(true);
            setCallerSignal(data);

            handleStartRecordingUserInput();
        });

        return () => {
            handleStopRecordingUserInput();
        }
    }, []);

    const pushUserInput = (userInput: IUserInput) => {
        ws.emit('guest-user-input', userInput)
    }


    const keyboardEventListener = useCallback((e: KeyboardEvent) => {
        const userInput: IUserInput = {
            userInputType: EUserInputType.Keyboard,
            event: {
                key: e.key
            }
        };
        
        pushUserInput(userInput);
    }, []);

    const mouseMoveEventListener = useCallback((e: MouseEvent) => {
        const userInput: IUserInput = {
            userInputType: EUserInputType.MouseMove,
            event: {
                x: e.x,
                y: e.y
            }
        };

        pushUserInput(userInput);
    }, []);

    const mouseClickEventListener = useCallback((e: MouseEvent) => {
        const userInput: IUserInput = {
            userInputType: EUserInputType.MouseClick
        };

        pushUserInput(userInput);
    }, []);

    const handleStartRecordingUserInput = (): void => {
        window.addEventListener('keyup', keyboardEventListener);
        window.addEventListener('mousemove', mouseMoveEventListener);
        window.addEventListener('mouseup', mouseClickEventListener)
    }

    const handleStopRecordingUserInput = (): void => {
        window.removeEventListener('keyup', keyboardEventListener);
        window.removeEventListener('mousemove', mouseMoveEventListener);
        window.removeEventListener('mouseup', mouseClickEventListener)
    }

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
        setLocalPeer(peer);
    }

    const handleHangUpCall = () => {
        localPeer?.destroy();
    }


    return (
        <React.Fragment>
            <div>I AM THE GUEST</div>
            <button disabled={!callerSignal} onClick={handleAcceptCall}>Accept Call</button>
            <button disabled={!receivingCall} onClick={handleHangUpCall}>Hang Up Call</button>
            <video ref={videoRef} autoPlay></video>
        </React.Fragment>
    );
}

export default Guest;