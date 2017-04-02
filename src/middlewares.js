import { verifyJWTToken } from './libs/auth'

/*
  Verifies whether required arguments are passed with HTTP request
  • list: array - [String]
*/
export function paramCheck(list)
{
  return (req, res, next) =>
  {
    let _paramList = (req.method === 'POST') ? req.body : req.params
    list.forEach((el) =>
    {
      if (!Object.keys(_paramList).includes(el) || _paramList[el].length < 1)
      {
        return res.status(400)
                .json({
                  message: `Missing arguments (${el})`
                })
      }

    })

    next()
  }
}

export function verifyJWT_MW(req, res, next)
{
  let token = (req.method === 'POST') ? req.body.token : req.query.token
  
  verifyJWTToken(token)
    .then((decodedToken) =>
    {
      req.user = decodedToken.data
      next()
    })
    .catch((err) =>
    {
      res.status(400)
        .json({message: "Invalid auth token provided."})
    })
}
