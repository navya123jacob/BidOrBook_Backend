import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;
    public users: { [uid: string]: string };
    public rooms: { [roomId: string]: string[] };

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.rooms = {};
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

        socket.on('handshake', ({ senderId, receiverId }, callback) => {
            console.info('Handshake received from: ' + socket.id);

            // Verify if callback is a function
            if (typeof callback !== 'function') {
                console.error('Callback is not a function');
                return;
            }

            const reconnected = Object.values(this.users).includes(socket.id);

            if (reconnected) {
                const users = Object.values(this.users);
                const roomId = this.GetRoomIdFromUserIds(senderId, receiverId);
                if (roomId) {
                    socket.join(roomId);
                    callback(roomId, users);
                    return;
                }
            }

            const userSocketId = this.users[senderId] || socket.id;
            this.users[senderId] = userSocketId;
            const otherUserSocketId = this.users[receiverId];
            const roomId = this.CreateOrGetRoom(senderId, receiverId);

            socket.join(roomId);
            if (otherUserSocketId) {
                this.io.sockets.sockets.get(otherUserSocketId)?.join(roomId);
            }

            const users = Object.values(this.users);
            callback(roomId, users);
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

        socket.on('chat_message', (message: { senderId: string, receiverId: string, text: string }) => {
            console.info('Chat message received from ' + socket.id);
            const roomId = this.GetRoomIdFromUserIds(message.senderId, message.receiverId);
            if (roomId) {
                this.SendMessageToRoom('chat_message', roomId, message);
            }
        });
    };

    CreateOrGetRoom = (uid1: string, uid2: string) => {
        const existingRoomId = this.GetRoomIdFromUserIds(uid1, uid2);
        if (existingRoomId) {
            return existingRoomId;
        }

        const newRoomId = v4();
        this.rooms[newRoomId] = [uid1, uid2];
        return newRoomId;
    };

    GetRoomIdFromUserIds = (uid1: string, uid2: string) => {
        return Object.keys(this.rooms).find(roomId => {
            const users = this.rooms[roomId];
            return users.includes(uid1) && users.includes(uid2);
        });
    };

    GetUidFromSocketID = (id: string) => {
        return Object.keys(this.users).find((uid) => this.users[uid] === id);
    };

    SendMessage = (name: string, users: string[], payload?: Object) => {
        users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
    };

    SendMessageToRoom = (name: string, roomId: string, payload: Object) => {
        this.io.to(roomId).emit(name, payload);
    };

    BroadcastMessage = (name: string, payload: Object) => {
        this.io.emit(name, payload);
    };
}
