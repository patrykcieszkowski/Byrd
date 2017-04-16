import { verifyJWTToken } from './auth'
import db from '../models'


console.log(db);

const clients = []
export default function SocketHandler(io)
{
  io.on('connection', (socket) =>
  {
    const queryString = socket.handshake.query
    const details = {
      authenticated: false,
      exp: null,
      user: {},
      type: null,
      socketId: socket.id
    }

    clients.push(details)

    socket.once('disconnect', () =>
    {
      const clientIndex = clients.findIndex((_client) => _client.socketId !== socket.id)
      clients.splice(clientIndex, 1)

      console.log(socket.rooms);
    })

    if (!queryString.token)
    {
      socket.emit('unauthenticated')
      socket.disconnect()
      return
    }

    // authenticate
    verifyJWTToken(queryString.token)
      .then((decodedToken) =>
    {
      details.type = decodedToken.type
      socket.emit('authenticated')

      if (decodedToken.type == 0)
      {
        details.user = decodedToken.data
        db.Chat.find({ _agents: details.user.id })
          .exec((err, chatList) =>
        {
          chatList.forEach((_chat) => socket.join(_chat._id.toString()))
        })
      }
      else if (decodedToken.type == 1)
      {
        details.user = decodedToken.data.guest
        socket.join(decodedToken.data.id)
      }

      socket.join('test')
      details.exp = decodedToken.exp
      details.authenticated = true
    })
      .catch((err) =>
    {
      console.info(err)
      socket.emit('unauthenticated')
      socket.disconnect()
    })

    socket.on('message', (data) =>
    {
      if (!details.authenticated
        || !data.message)
      {
        return
      }

      let roomId = Object.keys(socket.rooms).find((room) =>
      {
        return (details.type == 0) ? (room == data.room) : (room != socket.id)
      })

      const event = new db.ChatEvent({
        type: 0,
        content: data.message,
        _creator: details.user.id || null,
        _chat: roomId,
      })

      event.save()
        .then((_event) =>
      {
        socket.broadcast
              .to(roomId)
              .emit('message', { message: data.message, user: details.user })
      })
    })
  })
}
