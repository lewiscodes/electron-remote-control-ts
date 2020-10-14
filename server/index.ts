import express, { Application, Request, Response } from 'express';
import http from 'http';
import socketIo from 'socket.io';

const app: Application = express();
const server = http.createServer(app);
const io: socketIo.Server = socketIo(server);

let hostClient: string | undefined;
let guestClient: string | undefined;

app.get('/', (_req: Request, res: Response) => {
    res.send('<h1>Hello world</h1>');
});

const emitReady = (io: socketIo.Server) => io.emit('ready');
const emitNotReady = (io: socketIo.Server) => io.emit('not-ready');
const emitClientType = (socket: socketIo.Socket, clientType: 'HOST' | 'GUEST') => socket.emit('client-type', clientType);
const sendVideoToGuest = (io: socketIo.Server, video: Blob) => io.to(guestClient!).emit('video', video);

io.on('connection', async (socket: socketIo.Socket) => {
    if (!hostClient) {
        hostClient = socket.id
        emitClientType(socket, 'HOST');
    } else {
        guestClient = socket.id;
        emitClientType(socket, 'GUEST');
    }

    if (hostClient && guestClient) {
        emitReady(io);
    }

    socket.on('disconnect', () => {
        if (socket.id === hostClient) {
            hostClient = undefined;
            emitNotReady(io);
        }

        if (socket.id === guestClient) {
            guestClient = undefined;
            emitNotReady(io);
        }
    });

    socket.on('screenshare', (data: Blob) => {
        sendVideoToGuest(io, data);
    });
});

server.listen(5000, () => {
    console.log(`Server listening on port 5000 over HTTP.`);
});