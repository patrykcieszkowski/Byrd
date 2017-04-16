import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import socketio from 'socket.io'
import SocketHandler from './libs/sockets'

import config from './config'
import routes from './routes'

mongoose.connect(process.env.MONGO_URI)

const app = express()
const server = http.createServer(app)
app.io = socketio.listen(server)

SocketHandler(app.io)

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// routes
app.use('/auth', routes.auth)
app.use('/company', routes.company)
app.use('/chat', routes.chat)
app.use('/widget', routes.widget)

server.listen(process.env.PORT, () => {
  console.log("Ready to go! Port:", process.env.PORT)
})
