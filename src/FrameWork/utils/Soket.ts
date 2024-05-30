import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;
    public users: { [uid: string]: string };

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*'
            }
        });

        this.io.on('connect', this.StartListeners);
    }

    StartListeners = (socket: Socket) => {
        console.info('Message received from ' + socket.id);

        socket.on('handshake', (callback: (uid: string, users: string[]) => void) => {
            console.info('Handshake received from: ' + socket.id);
            const reconnected = Object.values(this.users).includes(socket.id);

            if (reconnected) {
                const uid = this.GetUidFromSocketID(socket.id);
                const users = Object.values(this.users);
                if (uid) {
                    callback(uid, users);
                    return;
                }
            }

            const uid = v4();
            this.users[uid] = socket.id;
            const users = Object.values(this.users);
            callback(uid, users);

            this.SendMessage('user_connected', users.filter((id) => id !== socket.id), users);
        });

        socket.on('disconnect', () => {
            console.info('Disconnect received from: ' + socket.id);
            const uid = this.GetUidFromSocketID(socket.id);
            if (uid) {
                delete this.users[uid];
                const users = Object.values(this.users);
                this.SendMessage('user_disconnected', users, socket.id);
            }
        });

        socket.on('chat_message', (message: { uid: string, text: string }) => {
            console.info('Chat message received from ' + socket.id);
            this.BroadcastMessage('chat_message', message);
        });
    };

    GetUidFromSocketID = (id: string) => {
        return Object.keys(this.users).find((uid) => this.users[uid] === id);
    };

    SendMessage = (name: string, users: string[], payload?: Object) => {
        users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
    };

    BroadcastMessage = (name: string, payload: Object) => {
        this.io.emit(name, payload);
    };
}
