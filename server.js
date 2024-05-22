// Require dependencies
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const morgan = require("morgan")
const path = require('path')

// Import express-session to manage user sessions
const session = require('express-session')

//  Import the auth controller
const authController = require('./controllers/auth.js')
const characterController = require('./controllers/characters.js')

// Import MongoStore
const MongoStore = require('connect-mongo')

// Import pass-user-to-view
const passUserToView = require('./middleware/pass-user-to-view.js')

// Connect to MongoDB via mongoose
mongoose.connect(process.env.MONGODB_URI)

//  Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json()) // expect JSON in request
app.use(express.urlencoded({ extended: false })) // expect data from our form
app.use(methodOverride('_method')) // to override requests in browser
app.use(morgan('dev')) // to log our HTTP requests
// Use sessions for auth
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  }),
}))
app.use(passUserToView)

// Use the auth controller for any requests that start with /auth or /character
app.use('/auth', authController)
app.use('/characters', characterController)

//  A route to render the homepage
app.get('/', (req, res) => {
  res.render('home.ejs', {
  });
});

// Catch-all route handler
app.get("*", (req, res) => {
  res.render("error.ejs", {msg: "Page not found!"})
})

// Default to port 3000 if no port in env file
const port = process.env.PORT ? process.env.PORT : 3000

//  Run port to continuously listen for HTTP requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Your secret is ${process.env.SECRET_PASSWORD}`);
  console.log(`My mongo db uri is ${process.env.MONGODB_URI}`);
});