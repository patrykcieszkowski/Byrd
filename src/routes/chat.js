import express from 'express'

import db from '../models'
import { createJWToken } from '../libs/auth'
import { paramCheck } from '../middlewares'

const router =  express.Router()

/*
  ROTUES
*/

console.log('sdsadsaasds');
router.post('/', paramCheck(['widget_id:body', 'first_name:body', 'last_name:body', 'email:body']))
router.post('/', (req, res) =>
{
  let { widget_id, first_name, last_name, email } = req.body

  const chat = new db.Chat({
    _agents: ['58e11dd7f64951bc3ffdfac5'], // temporary
    _widget: widget_id,
    guest: {
      email: email,
      first_name: first_name,
      last_name: last_name
    }
  })

  chat.save()
    .then((_chat) => _chat.toJSON())
    .then((_chat) =>
  {
    res.status(200)
      .json({
        success: true,
        token: createJWToken({
          sessionData: { data: _chat, type: 1 },
          maxAge: 360000
        })
      })
  })
    .catch((err) =>
  {
    res.status(400)
      .json({
        message: err.toString()
      })
  })
})

export default router
