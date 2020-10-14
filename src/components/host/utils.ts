export const startScreenRecord = async (): Promise<MediaStream | undefined> => {
    return window.desktopCapturer.getSources({ types: ['screen'] }).then(async (sources: Electron.DesktopCapturerSource[]) => {
        const source: Electron.DesktopCapturerSource = sources[0];

        try {
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    // @ts-ignore
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: source.id
                    }
                }
            });

            return stream;
        } catch (error) {
            console.log(error);
        }
    })
};