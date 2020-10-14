import React, { useState } from 'react';
import { startScreenRecord } from './utils';
import styles from '../styles.module.scss';

const RemoteControlToolbar = (): JSX.Element => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
    const [recordedChunks, setRecordedChunks] = useState<Blob>();
    const [recordedVideo, setRecordedVideo] = useState<string>();

    const handleStartRecording = async (): Promise<void> => {
        if (!isRecording && !recordedChunks) {
            setIsRecording(true);
            const newMediaRecorder = await startScreenRecord(setRecordedChunks);
            setMediaRecorder(newMediaRecorder);
        }
    }

    const handleStopRecording = (): void => {
        if (isRecording) {
            setIsRecording(false);
    
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
        }
    }

    const handlePlayRecording = (): void => {
        if (recordedChunks) {
            setRecordedVideo(URL.createObjectURL(recordedChunks))
        }
    }

    const handleKillRecording = (): void => {
        if (recordedVideo) {
            setRecordedChunks(undefined);
            setRecordedVideo(undefined);
        }
    }

    return (
        <React.Fragment>
            <div className={styles.functionContainer}>
                <span>Screen Recording</span>
                <div className={styles.iconContainer}>
                    <button
                        onClick={handleStartRecording}
                        disabled={isRecording || !!recordedChunks?.size}
                    >Start Recording</button>
                    <button
                        onClick={handleStopRecording}
                        disabled={!isRecording}
                    >Stop Recording</button>
                    <button
                        onClick={handlePlayRecording}
                        disabled={!!recordedVideo || !recordedChunks}
                    >Play Recording</button>
                    <button
                        onClick={handleKillRecording}
                        disabled={!recordedVideo}
                    >Delete Recording</button>
                </div>
                {recordedVideo && <video autoPlay src={recordedVideo} />}
            </div>
        </React.Fragment>
    );

};

export default RemoteControlToolbar;