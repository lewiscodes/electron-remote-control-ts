import React from 'react';

interface IGuestProps {
    readonly ws: SocketIOClient.Socket;
}

const Guest = ({ ws }: IGuestProps): JSX.Element => {
    ws.on('video', (data: Blob) => {
        console.log('hellooo', data);
    });

    return (
        <div>I AM THE GUEST</div>
    );
}

export default Guest;