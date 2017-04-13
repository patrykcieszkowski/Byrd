import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import config from './config'
import routes from './routes'

mongoose.connect(process.env.MONGO_URI)

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// routes
app.use('/auth', routes.auth)

app.listen(config.PORT, () => {
  console.log("Ready to go! Port:", config.PORT)
})
