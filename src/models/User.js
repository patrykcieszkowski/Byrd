import mongoose, {Schema} from 'mongoose'
import {isEmail} from 'validator'
import bcrypt from 'bcrypt'

mongoose.Promise = global.Promise

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    minlength: [5],
    validate: {
      isAsync: true,
      validator: isEmail,
      message: 'Invalid email format.'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must have at least 6 chars."]
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

userSchema.pre('save', function(next)
{
  let _user = this
  
  /*
    Hash the password, if field was modified.
  */
  if (_user.isModified('password'))
  {
    _user.password = bcrypt.hashSync(_user.password, bcrypt.genSaltSync(10))
  }
  
  return next()
})

userSchema.post('save', (err, doc, next) =>
{
  if (err.name === 'MongoError' && err.code === 11000)
  {
    next("Email you've given is already used.")
  }
  else if (err.errors)
  {
    let firstErrorKey = Object.keys(err.errors)[0]
    next(new Error(err.errors[firstErrorKey].message))
  }

  next(err)
})

userSchema.methods.comparePassword = function(password)
{
  return new Promise((resolve, reject) =>
  {
    bcrypt.compare(password, this.password, (err, isMatch) =>
    {
      if (err || !isMatch)
      {
        return reject(err)
      }

      resolve(this)
    })
  })
}

userSchema.methods.publicParse = function()
{
  let _user = this.toJSON()
  delete _user.password
  return _user
}

userSchema.statics.findByEmail = function(email)
{
  return this.findOne({ email }).exec()
}

const User = mongoose.model('User', userSchema)
export default User