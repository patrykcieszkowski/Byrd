import jwt from 'jsonwebtoken'
import _ from 'lodash'

import config from '../config'

/*
  checks whether provided token is valid or not; based on it's signature and expire date
*/
export function verifyJWTToken(token, callback)
{
  return new Promise((resolve, reject) =>
  {
    jwt.verify(token, config.JWT_SECRET, (err, decodedToken) =>
    {
      if (err || !decodedToken)
      {
        return reject(err)
      }

      resolve(decodedToken)
    })
  })
}

export function createJWToken(details)
{
  if (typeof details !== 'object')
  {
    details = {}
  }

  if (!details.maxAge || typeof details.maxAge !== 'number')
  {
    details.maxAge = 3600
  }

  details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) =>
  {
    if (typeof val !== "function" && key !== "password")
    {
      memo[key] = val
    }
    return memo
  }, {})

  let token = jwt.sign({
    data: details.sessionData }, config.JWT_SECRET, {
    expiresIn: details.maxAge,
    algorithm: 'HS256'
  })

  return token
}

export default {
  verifyJWTToken,
  createJWToken
}
