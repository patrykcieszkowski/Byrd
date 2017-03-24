import { expect } from 'chai'
import db from '../src/models'

import mongoose from 'mongoose'

describe('USER MODEL', () =>
{
  before((done) =>
  {
    mongoose.connect(process.env.MONGO_URI)
    const db = mongoose.connection
    db.once('open', () => done())
  })
  
  describe('DATABASE', () =>
  {
    const userData = {
      valid: { email: 'success@example.com', password: 'password' },
      invalid: { email: 'fail@example.com', password: 'wrong-password' }
    }
    
    it('should save a new user document and hash the password', (done) =>
    {
      const newUser = new db.User(userData.valid)
      newUser.save()
        .then((user) =>
        {
          expect(user).to.have.property('password').and.not.to.equal(userData.password)
          done()
        })
        .catch(console.log)
    })

    describe('methods and statics', () =>
    {
      it('should fail while looking for a user', (done) =>
      {
        db.User.findByEmail(userData.invalid.email)
          .then((user) => (!user) ? Promise.reject({message: 'User not found.'}) : user)
          .catch((err) =>
          {
            expect(err).to.have.property('message', 'User not found.')
            done()
          })
      })

      it('should find a user, compare the passwords and parse the document to JSON', (done) =>
      {
        db.User.findByEmail(userData.valid.email)
          .then((user) => (!user) ? Promise.reject({message: 'User not found.'}) : user)
          .then((user) => user.comparePassword(userData.valid.password))
          .then((user) => user.publicParse(user))
          .then((user) => 
          {
            expect(user).to.have.property('email', 'success@example.com')
            expect(user).to.have.property('id')
            expect(user).not.to.have.property('_id')
            expect(user).not.to.have.property('password')
            done()
          })
          .catch(console.log)
      })
    })
  })
  
  describe('VALIDATION', () =>
  {
    describe('password', () =>
    {
      it('should return an error if password string is empty', (done) =>
      {
        const user = new db.User({email: 'success@example.com'})
        user.validate((err) =>
        {
          expect(err.errors.password).to.exist
          done()  
        })
      })

      it('should return an error if password is too short', (done) =>
      {
        const user = new db.User({email: 'success@example.com', password: '123'})
        user.validate((err) =>
        {
          expect(err.errors.password).to.exist
          done()
        })
      })
    })

    describe('email', () =>
    {
      it('should return an error if email validation fails', (done) =>
      {
        const user = new db.User({email: 'invalid email', password: 'password'})
        user.validate((err) =>
        {
          expect(err.errors.email).to.exist
          done()
        })
      })

      it('should return an error if email string is empty', (done) =>
      {
        const user = new db.User({password: 'password'})
        user.validate((err) =>
        {
          expect(err.errors.email).to.exist
          done()
        })
      })

      it('should return an error if email is too short', (done) =>
      {
        const user = new db.User({password: '123'})
        user.validate((err) =>
        {
          expect(err.errors.email).to.exist
          done()
        })
      })
    })
  })

  after((done) =>
  {
    mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done))
  })
})
