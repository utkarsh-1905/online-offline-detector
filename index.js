const express = require('express')
const app = express()
const http = require('http')
const { createClient } = require('redis')
const server = http.createServer(app)

async function notifyFriends(msg){

}

const main = async () => {
    const redisClient = createClient()

    redisClient.on('error', err => console.log('Redis Client Error', err));

    await redisClient.connect()

    const { Server } = require('socket.io')
    const io = new Server(server)

    io.on('connection',(socket)=>{
        console.log("A user connected", socket.id)
        socket.on('disconnect',()=>{
            console.log("A user disconnected")
        })

        socket.on('online',async (msg)=>{
            await redisClient.set(msg,'online')
            console.log('user is online', msg)
            notifyFriends(msg)
        })
        
        socket.on('offline',async (msg)=>{
            await redisClient.set(msg,'offline')
            console.log('user is offline', msg)
            notifyFriends(msg)
        })
    })

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    server.listen(3000, ()=>{
        console.log("Listening on 3000")
    })
}

main()