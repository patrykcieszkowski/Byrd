import express from 'express'

import db from '../models'
import { verifyJWT_MW, paramCheck } from '../middlewares'

const router = express.Router()

/*
  ROUTES
*/

router.all('*', verifyJWT_MW)

router.post('/', paramCheck(['name:body']))
router.post('/', (req, res) =>
{
  const { name } = req.body
  const company =  db.Company({
    name,
    _owner: req.user.id
  })

  company.save()
    .then((_company) => _company.toJSON())
    .then((_company) =>
    {
      res.status(200)
        .json({
          success: true,
          data: _company
        })
    })
    .catch((err) =>
    {
      res.status(400)
        .json({
          message: err
        })
    })
})

router.delete('/:_id', paramCheck(['_id:params']))
router.delete('/:_id', (req, res) =>
{
  const { _id } = req.params
  db.Company.findById(_id).populate('_owner').exec()
    .then((_company) => (!_company) ? Promise.reject("Not found.") : _company)
    .then((_company) => (_company._owner._id.toString() !== req.user.id) ? Promise.reject('Unauthorized') : _company)
    .then((_company) => _company.remove(Promise.reject))
    .then((_company) =>
    {
      res.status(200)
        .json({
          success: true
        })
    })
    .catch((err) =>
    {
      res.status(403)
        .json({
          message: err
        })
    })
})


export default router
