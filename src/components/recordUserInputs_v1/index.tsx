import React, { ChangeEvent, useState, useCallback } from 'react';
import styles from '../styles.module.scss';

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

const UserInputRecording = (): JSX.Element => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [userInputs, setUserInputs] = useState<IUserInput[]>([]);
    const [isReplayingUserInput, setIsReplayingUserInput] = useState<boolean>(false);
    const [textValue, setTextValue] = useState<string>('');

    const keyboardEventListener = useCallback((e: KeyboardEvent) => {
        userInputs.push({
            userInputType: EUserInputType.Keyboard,
            event: {
                key: e.key
            }
        });
        setUserInputs(userInputs);
    }, []);

    const mouseMoveEventListener = useCallback((e: MouseEvent) => {
        userInputs.push({
            userInputType: EUserInputType.MouseMove,
            event: {
                x: e.x,
                y: e.y
            }
        })

        setUserInputs(userInputs);
    }, []);

    const mouseClickEventListener = useCallback((e: MouseEvent) => {
        userInputs.push({
            userInputType: EUserInputType.MouseClick
        })

        setUserInputs(userInputs);
    }, []);

    const handleStartRecordingUserInput = (): void => {
        setIsRecording(true);
        window.addEventListener('keyup', keyboardEventListener);
        window.addEventListener('mousemove', mouseMoveEventListener);
        window.addEventListener('mouseup', mouseClickEventListener)
    }

    const handleStopRecordingUserInput = (): void => {
        setIsRecording(false);
        window.removeEventListener('keyup', keyboardEventListener);
        window.removeEventListener('mousemove', mouseMoveEventListener);
        window.removeEventListener('mouseup', mouseClickEventListener)
    }

    const handleStartReplayingUserInput = (): void => {
        if (userInputs.length) {
            setIsReplayingUserInput(true);
            window.ipcRenderer.send('remoteControl', userInputs);
        }
    }

    const handleDeleteSavedUserInput = (): void => {
        if (userInputs.length) {
            setIsReplayingUserInput(false);
            setUserInputs([]);
        }
    }

    return (
        <div style={{ width: '90%' }}>
            <div className={styles.functionContainer}>
                <span>User Input Recording</span>
                <div className={styles.iconContainer}>
                    <button
                        onClick={handleStartRecordingUserInput}
                        disabled={!!userInputs.length || isRecording}
                    >Start Recording</button>
                    <button
                        onClick={handleStopRecordingUserInput}
                        disabled={!isRecording}
                    >Stop Recording</button>
                    <button
                        onClick={handleStartReplayingUserInput}
                        disabled={!userInputs?.length || isReplayingUserInput || isRecording}
                    >Play Recording</button>
                    <button
                        onClick={handleDeleteSavedUserInput}
                        disabled={!isReplayingUserInput}
                    >Delete Recording</button>
                </div>
            </div>
            <textarea
                style={{ width: '100%', margin: 10, height: 300 }}
                value={textValue}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTextValue(e.target.value)}
            />
        </div>
    );

};

export default UserInputRecording;