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