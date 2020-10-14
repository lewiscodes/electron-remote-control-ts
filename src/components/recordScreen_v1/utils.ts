const mimeType = 'video/webm; codecs=vp9';

export const startScreenRecord = async (setRecordedChunks: Function): Promise<MediaRecorder | undefined> => {
    const recordedChunks: Blob[] = [];

    return window.desktopCapturer.getSources({ types: ['screen'] }).then(async (sources: Electron.DesktopCapturerSource[]) => {
        const source: Electron.DesktopCapturerSource = sources[0];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    // @ts-ignore
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: source.id
                    }
                }
            });

            const mediaRecorder: MediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorder.ondataavailable = (e: BlobEvent) => handleMediaRecorderDataAviailable(e, recordedChunks);
            mediaRecorder.onstop = (e: Event) => handleMediaRecordedStop(e, recordedChunks, setRecordedChunks);
            mediaRecorder.start();

            return mediaRecorder;
        } catch (error) {
            console.log(error);
        }
    })
}

const handleMediaRecorderDataAviailable = (e: BlobEvent, recordedChunks: Blob[]) => {
    recordedChunks.push(e.data);
}

const handleMediaRecordedStop = (_e: Event, recordedChunks: Blob[], setRecordedChunks: Function): void => {
    setRecordedChunks(new Blob(recordedChunks, {
        type: mimeType
    }));
}