const path = require('path')
const express = require('express')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const mainRoutes = require('./routes/main')
const authRoutes = require('./routes/auth')
const gridsRoutes = require('./routes/grids')

require('dotenv').config({ path: './config/config.env' })

const app = express()

// Proxy requests to frontend (React development server)
app.use(
  cors({
    origin: 'https://myharada.netlify.app', // Your React app's URL
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true, // Allow cookies to be sent with requests (important for sessions)
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  })
)

// Logging
if (process.env.NODE_ENV === 'development') {
  console.log('dev time baybee')
  app.use(morgan('dev'))
}

// Passport config
app.set('trust proxy', 1)
require('./config/passport')(passport)

connectDB()

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'build')))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      touchAfter: 24 * 3600, // lazy session update
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// app.use(flash())

app.use('/', mainRoutes)
app.use('/auth', authRoutes)
app.use('/api/grids', gridsRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
