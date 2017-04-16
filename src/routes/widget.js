import express from 'express'

import db from '../models'
import { verifyJWT_MW, paramCheck } from '../middlewares'

const router = express.Router()

router.all('*', verifyJWT_MW)

router.post('/', paramCheck(['title:body', 'url:body', 'company_id:body']))
router.post('/', (req, res) =>
{
  const { title, url, company_id } = req.body

  const widget = new db.Widget({
    title: title,
    url: url,
    _company: company_id,
    _creator: req.user.id
  })

  widget.save()
    .then((_widget) => _widget.toJSON())
    .then((_widget) =>
  {
    res.status(200)
      .json({
        success: true,
        data: _widget
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
