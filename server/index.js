"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
let hostClient;
let guestClient;
app.get('/', (_req, res) => {
    res.send('<h1>Hello world</h1>');
});
var EUserInputType;
(function (EUserInputType) {
    EUserInputType["Keyboard"] = "KEYBOARD";
    EUserInputType["MouseMove"] = "MOUSE_MOVE";
    EUserInputType["MouseClick"] = "MOUSE_CLICK";
})(EUserInputType = exports.EUserInputType || (exports.EUserInputType = {}));
;
const emitReady = (io) => io.emit('ready');
const emitNotReady = (io) => io.emit('not-ready');
const emitClientType = (socket, clientType) => socket.emit('client-type', clientType);
const sendHostPeerSignalToGuest = (io, hostPeerSignal) => io.to(guestClient).emit('call-received', hostPeerSignal);
const sendGuestPeerSignalToHost = (io, guestPeerSignal) => io.to(hostClient).emit('call-accepted', guestPeerSignal);
const sendUserInputToHost = (io, userInput) => io.to(hostClient).emit('host-user-input', userInput);
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    if (!hostClient) {
        hostClient = socket.id;
        emitClientType(socket, 'HOST');
    }
    else {
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
    socket.on('call-guest', (data) => {
        sendHostPeerSignalToGuest(io, data);
    });
    socket.on('accept-call', (data) => {
        sendGuestPeerSignalToHost(io, data);
    });
    socket.on('guest-user-input', (data) => {
        sendUserInputToHost(io, data);
    });
}));
server.listen(5000, () => {
    console.log(`Server listening on port 5000 over HTTP.`);
});
