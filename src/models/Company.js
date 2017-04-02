import mongoose, { Schema } from 'mongoose'
import * as idExists from 'mongoose-idexists'

mongoose.Promise = global.Promise

const companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  _owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  _agents: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
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

idExists.forPath(companySchema.path('_agents'))
idExists.forPath(companySchema.path('_owner'))

const Company = mongoose.model('Company', companySchema)
export default Company
