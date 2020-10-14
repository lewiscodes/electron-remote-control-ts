import React, { useState } from 'react';
import { startScreenRecord } from './utils';

interface IHostProps {
    readonly ws: SocketIOClient.Socket;
}

const Host = ({ ws }: IHostProps): JSX.Element => {
    const [isSharingScreen, setIsShardingScreen] = useState<boolean>(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

    const handleStartScreenShare = async() => {
        setIsShardingScreen(true);
        const stream = await startScreenRecord();
        const media = new MediaRecorder(stream!);
        media.ondataavailable = (blob: BlobEvent) => {
            console.log(blob.data);
            ws.emit('screenshare', blob.data);
        }
        media.start(100);
        setMediaRecorder(media);
    }

    const handleStopScreenShare = () => {
        setIsShardingScreen(false);
        mediaRecorder?.stop();
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>{`I AM THE HOST - ${isSharingScreen ? 'SHARING SCREEN' : 'NOT SHARING SCREEN'}`}</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={handleStartScreenShare} disabled={isSharingScreen}>Start Screen Share</button>
                <button style={{ marginLeft: 10 }} onClick={handleStopScreenShare} disabled={!isSharingScreen}>Stop Screen Share</button>
            </div>
        </div>
    );
}

export default Host;