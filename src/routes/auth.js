import express from 'express'
import bcrypt from 'bcrypt'

import db from '../models'
import {createJWToken} from '../libs/auth'
import {authDetails_MW} from '../middlewares'

const router = express.Router()

/*
  ROUTES
*/

router.post('*', authDetails_MW)

router.post('/login', (req, res) => 
{
  let { email, password } = req.body
  
  db.User.findByEmail(email)
  .then((user) => (!user) ? Promise.reject('User not found.') : user)
  .then((user) => user.comparePassword(password))
  .then((user) => user.publicParse(user))
  .then((user) =>
  {
    res.status(200)
      .json({
        status: true,
        token: createJWToken({
            sessionData: user,
            maxAge: 3600
          })
      })
  })
  .catch((err) =>
  {
    res.status(401)
      .json({
        message: err || "Validation failed. Given email and password aren't matching."
      })
  })
})

router.post('/signup', (req, res) => 
{
  let { email, password } = req.body

  const user = db.User({
    email,
    password
  })

  user.save()
    .then((user) => user.publicParse(user))  
    .then((user) =>
    {
      res.status(200)
        .json({
          success: true,
          token: createJWToken({
            sessionData: user,
            maxAge: 3600
          })
        })
    })
    .catch((err) =>
    {
      res.status(401)
        .json({
          message: err.toString()
        })
    })
})

export default router