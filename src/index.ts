
import app from "./FrameWork/webserver/config/app";
import connectDb from "./FrameWork/webserver/config/db";
import { initializeSocket } from "./FrameWork/utils/Soket";
import http from 'http';
require('dotenv').config();
const port = process.env.PORT || 3000; 
const frontendUrl = process.env.frontend|| process.env.local;
const server = http.createServer(app);

const io = initializeSocket(server);

const start = async () => {
    try {
        await connectDb(); 
        server.listen(port, () => { 
            console.log(`Server started on ${frontendUrl}:${port}`);
        });
        // server.listen(port, '0.0.0.0', () => { 
        //     console.log(`Server started on ${frontendUrl}:${port}`);
        // });

        console.log(`Frontend URL: ${frontendUrl}`);
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1); 
    }
};

start();

export { io };
