import { verifyJWTToken } from './libs/auth'

/*
  Verifies whether required arguments are passed with HTTP request
  • list: array - [String]
*/
export function paramCheck(list)
{
  return (req, res, next) =>
  {
    list.forEach((el) =>
    {
      // split if possible - if not, set as array
      const _el = (el.includes(':')) ? el.split(':') : [el, 'query']
      const _paramList = req[_el[1]]

      if (!Object.keys(_paramList).includes(_el[0]) || _paramList[_el[0]].length < 1)
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
