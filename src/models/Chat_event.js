import mongoose, { Schema } from 'mongoose'
import * as idExists from 'mongoose-idexists'
import { isEmail } from 'validator'
import bcrypt from 'bcrypt'

mongoose.Promise = global.Promise

const chatEventSchema = new Schema({
  content: {
    type: String,
  },
  type: {
    type: Number,
    required: true
  },
  _creator: {
    type: Schema.ObjectId,
    ref: 'User',
    required: false
  },
  _chat: {
    type: Schema.ObjectId,
    ref: 'Chat',
    required: true
  }
}, {
  toJSON: {
    transform: function(doc, ret)
    {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    }
  }
})

idExists.forPath(chatEventSchema.path('_creator'))
idExists.forPath(chatEventSchema.path('_chat'))

const ChatEvent = mongoose.model('ChatEvent', chatEventSchema)
export default ChatEvent
