import mongoose, { Schema } from 'mongoose'
import * as idExists from 'mongoose-idexists'
import { isEmail } from 'validator'

mongoose.Promise = global.Promise

const chatSchema = new Schema({
  _agents: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  _company: {
    type: Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  _widget: {
    type: Schema.ObjectId,
    ref: 'Widget',
    required: true
  },
  guest: {
    email: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      minlength: [5],
      validate: {
        isAsync: true,
        validator: isEmail,
        message: "Invalid email format."
      }
    },
    first_name: {
      type: String,
      required: true,
      minlength: [3, "Name needs to be at least 3 chars long."]
    },
    last_name: {
      type: String,
      required: true,
      minlength: [3, "Name needs to be at least 3 chars long."]
    },
  },
  createdAt: {
    type: Date,
    default: Date.now
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

idExists.forPath(chatSchema.path('_company'))
idExists.forPath(chatSchema.path('_agents'))

const Chat = mongoose.model('Chat', chatSchema)
export default Chat
