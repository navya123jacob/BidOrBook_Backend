import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

interface Bid {
    userId: string;
    amount: number;
}

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;
    public users: { [uid: string]: string };
    public rooms: { [roomId: string]: string[] };
    public bids: { [roomId: string]: Bid } = {};

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.rooms = {};
        // this.io = new Server(server, {
        //     serveClient: false,
        //     pingInterval: 10000,
        //     pingTimeout: 5000,
        //     cookie: false,
        //     cors: {
        //         origin: '*'
        //     }
        // });
        this.io = new Server(server, {
            cors: {
                origin: ['https://bid-or-book.vercel.app'], // Add specific allowed origins here
            },
        });
      

        this.io.on('connect', this.StartListeners);
    }

    StartListeners = (socket: Socket) => {
        socket.on('handshake', ({ senderId, receiverId }, callback) => {
            console.info('Handshake received from: ' + socket.id);

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

        // Handle joining auction rooms
        socket.on('join_auction', ({ auctionId }) => {
            socket.join(`auction_${auctionId}`);
            console.log(`User ${socket.id} joined auction room ${auctionId}`);
        });

        socket.on('cancel_bid', ({ auctionId, userId }) => {
            this.handleCancelBid(socket, auctionId, userId);
        });

        socket.on('disconnect', () => {
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
                this.sendMessageToRoom('chat_message', roomId, message);
            }
        });

        socket.on('place_bid', (bid: { userId: string; amount: number; roomId: string }, callback) => {
            console.info('vavao ');
            this.handlePlaceBid(socket, bid, callback);
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

    sendMessageToRoom = (name: string, roomId: string, payload: object) => {
        this.io.to(roomId).emit(name, payload);
    };

    BroadcastMessage = (name: string, payload: Object) => {
        this.io.emit(name, payload);
    };

    handlePlaceBid = (socket: Socket, bid: { userId: string; amount: number; roomId: string }, callback: Function): void => {
        console.info(`Bid received from ${bid.userId} in room ${bid.roomId}`);
    
        if (!this.rooms[bid.roomId]) {
            console.error('Invalid room ID');
            callback({ success: false, message: 'Invalid room ID' });
            return;
        }
    
        const currentBid = this.bids[bid.roomId];
        if (currentBid && bid.amount <= currentBid.amount) {
            console.error('Bid amount too low');
            callback({ success: false, message: 'Bid amount must be higher than the current highest bid' });
            return;
        }
    
        this.bids[bid.roomId] = { userId: bid.userId, amount: bid.amount };
        this.sendMessageToRoom('new_bid', bid.roomId, { ...bid, auctionId: bid.roomId });
        callback({ success: true, message: 'Bid placed successfully' });
    };
    handleCancelBid = (socket: Socket, auctionId: string, userId: string) => {
        console.info(`Bid cancelled by user ${userId} in auction ${auctionId}`);
        
        if (!this.rooms[`auction_${auctionId}`]) {
            console.error('Invalid auction ID');
            return;
        }

        if (this.bids[`auction_${auctionId}`] && this.bids[`auction_${auctionId}`].userId === userId) {
            delete this.bids[`auction_${auctionId}`];
        }

        this.sendMessageToRoom('cancel_bid', `auction_${auctionId}`, { auctionId, userId });
    };
    
}

// Function to initialize and export the io instance
export const initializeSocket = (server: HttpServer): Server => {
    const socketServer = new ServerSocket(server);
    return socketServer.io;
};
