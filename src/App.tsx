import React, { useState } from 'react';
import Connect from './components/connect';
import Connected from './components/connected';
import styles from './styles.module.scss';

function App() {
    const [ws, setWs] = useState<SocketIOClient.Socket>();

    return (
        <div className={styles.app}>
            {!ws && <Connect setWs={setWs} />}
            {ws && <Connected ws={ws} setWs={setWs} />}
        </div>
    );
}

export default App;
