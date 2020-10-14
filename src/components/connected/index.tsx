import React, { useState } from 'react';
import Guest from '../guest';
import Host from '../host';

interface IConnectedProps {
    readonly ws: SocketIOClient.Socket;
    readonly setWs: Function;
}

const Connected = ({ ws, setWs }: IConnectedProps): JSX.Element => {
    const [ready, setReady] = useState<Boolean>(false);
    const [clientType, setClientType] = useState<'HOST' | 'GUEST'>();

    ws.on('client-type', (args: 'HOST' | 'GUEST') => {
        setClientType(args)
    })

    ws.on('ready', () => {
        setReady(true);
    });

    ws.on('not-ready', () => {
        setReady(false);
    });

    const handleDisconnect = () => {
        ws.disconnect();
        setWs(undefined);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{`Connected as ${clientType}`}</div>
                <button onClick={handleDisconnect}>Disconnect</button>
                <div>{`Ready? - ${ready}`}</div>
            </div>
            {ready && clientType === 'GUEST' && <Guest ws={ws} />}
            {ready && clientType === 'HOST' && <Host ws={ws} />}
        </div>
    );
};

export default Connected;
