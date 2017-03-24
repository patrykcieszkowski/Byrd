import { verifyJWTToken } from './libs/auth'

export function authDetails_MW(req, res, next)
{
  let { email, password } = req.body
  if (!email || !password)
  {
    return res.status(400)
            .json({ message: "Missing auth data." })
  }

  next()
}

export function verifyJWT_MW(req, res, next)
{
  let { token } = req.body
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