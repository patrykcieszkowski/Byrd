import mongoose, { Schema } from 'mongoose'
import * as idExists from 'mongoose-idexists'
import { isURL } from 'validator'

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
    rer: 'Company',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

idExists.forPath(widgetSchema.path('_company'))

const Widget = mongoose.model('Widget', widgetSchema)
export default Widget
