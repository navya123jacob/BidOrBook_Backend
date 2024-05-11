require('dotenv').config()
import app from "./FrameWork/webserver/config/app";
import connectDb from "./FrameWork/webserver/config/db";
// import socket  from './socket/socket'
import http from 'http'

const port =8888
const server = http.createServer(app)

const start = ()=>{
    app.listen(port,()=>{
        console.log(`server started on http://localhost:${port}`);
        connectDb()
        // socket(server)
    })
}

start()