import electron from 'electron';

declare global {
    interface Window extends Window {
        ipcRenderer: electron.IpcRenderer;
        desktopCapturer: electron.DesktopCapturer;       
    }
}