import mongoose, { Schema } from 'mongoose'
import * as idExists from 'mongoose-idexists'
import { isURL } from 'validator'

import db from './'

mongoose.Promise = global.Promise

const widgetSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: [3, "Title needs to have at least 3 chars."]
  },
  url: {
    type: String,
    required: true,
    validate: {
      isAsync: true,
      validator: isURL,
      message: "Invalid URL"
    }
  },
  _company: {
    type: Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  _creator: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

idExists.forPath(widgetSchema.path('_company'))
idExists.forPath(widgetSchema.path('_creator'))

widgetSchema.pre('save', function(next)
{
  const _widget = this

  db.Company.findById(_widget._company).exec()
    .then((_company) => _company.toJSON())
    .then((_company) =>
  {
    if (_company._owner.toString() !== _widget._creator.toString())
    {
      throw new Error('Unauthorized Access!')
    }
    next()
  })
    .catch(console.log)
})

const Widget = mongoose.model('Widget', widgetSchema)
export default Widget
