import React, { useState } from 'react';
import webSocket from 'socket.io-client';

interface IConnectProps {
    readonly setWs: Function;
}

const Connect = ({ setWs }: IConnectProps): JSX.Element => {
    const [address, setAddress] = useState<string>('ws://192.168.1.204:5000');
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value);
    const handleConnect = () => {
        if (address.length) {
            const io = webSocket(address, {
                query: {
                    arg: window.navigator.userAgent
                }
            });
            setWs(io);
        }
    }

    return (
        <div>
            <label htmlFor="address_input">Server Address: </label>
            <input
                id="address_input"
                style={{ width: 200 }}
                value={address}
                onChange={handleAddressChange}
            />
            <button
                style={{ marginLeft: 5 }}
                onClick={handleConnect}
            >Connect</button>
        </div>
    );
};

export default Connect;