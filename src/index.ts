require('dotenv').config();
import app from "./FrameWork/webserver/config/app";
import connectDb from "./FrameWork/webserver/config/db";
import { ServerSocket } from "./FrameWork/utils/Soket";
import http from 'http';

const port = process.env.PORT || 3000; 
const server = http.createServer(app);

// Initialize Socket.IO server
new ServerSocket(server);

const start = async () => {
    try {
        await connectDb(); 
        server.listen(port, () => { 
            console.log(`Server started on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1); 
    }
};

start();
