require('dotenv').config({path: './.env'})
import { expect } from 'chai'
import { verifyJWTToken, createJWToken } from '../src/libs/auth'

describe('JWToken', () =>
{
  let token = null
  const userData = {email: 'success@example.com', id: '123', password: 'password' }

  it('should create a token', (done) =>
  {
    token = createJWToken({
      sessionData: {email: 'success@example.com', id: '123'},
      maxAge: 3600
    })

    expect(token).to.be.a('string')
    done()
  })

  it('should sucessfully verify the token', (done) =>
  {
    verifyJWTToken(token)
    .then((decodedToken) => 
    {
      expect(decodedToken).to.have.property('data')
      expect(decodedToken.data).to.have.property('email', userData.email)
      expect(decodedToken.data).to.have.property('id', userData.id)
      expect(decodedToken.data).not.to.have.property('password')
      done()
    })
    .catch(console.log)
  })
})