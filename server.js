// Require dependencies
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Characters = require('./models/characters')
const methodOverride = require("method-override")
const morgan = require("morgan")
const path = require('path')

// Import express-session to manage user sessions
const session = require('express-session')

//  Import the auth controller
const authController = require('./controllers/auth.js')

// Import MongoStore
const MongoStore = require('connect-mongo')

// Import is-signed-in 
const isSignedIn = require('./middleware/is-signed-in.js')

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

// Use the auth controller for any requests that start with /auth
app.use('/auth', authController)

//  A route to render the homepage
app.get('/', (req, res) => {
  res.render('home.ejs', {
  });
});

// A route that gets ALL documents from the collection and renders on 'Characters' page
app.get('/characters', async (req, res) => {
  try {
      const characters = await Characters.find()
      res.render('characters.ejs', {
      characters,
      })
  } catch (error) {
      res.render('error.ejs', { msg: error.message })
  }
})

// A route that gets ONE document from the collection using its Id and renders it on a 'show' page
app.get('/characters/:characterId', async (req, res) => {
  try {
      const character = await Characters.findById(req.params.characterId)
      res.render('show.ejs', {
        character,
      })
  } catch (error) {
      res.render('error.ejs', { msg: error.message })
  }
})

// A route that renders a page for the user to add a new character
app.get('/new-character', isSignedIn, (req, res) => {
  res.render('new.ejs', {
  })
})

// A route that creates (POSTs) a new character based on info submitted in form
app.post('/characters', async (req, res) => {
  try {
      if (!req.body.name.trim() || !req.body.actor.trim() || !req.body.episodes.trim() || !req.body.description.trim() || !req.body.image.trim()) {
        throw new Error('Invalid input: please fill all required fields.')
      }
      const character = await Characters.create(req.body)
      // Redirects the user to a new'show' page for that character
      res.redirect(`/characters/${character.id}`)
  } catch (error) {
      res.render('error.ejs', { msg: error.message })
  }
})

// A route to update (PUT) a document in the collection 
app.put('/characters/:characterId', async (req, res) => {
  try {
      if (!req.body.name.trim() || !req.body.actor.trim() || !req.body.episodes.trim() || !req.body.description.trim() || !req.body.image.trim()) {
        throw new Error('Invalid input: please fill all required fields.')
      }
      const character = await Characters.findByIdAndUpdate(req.params.characterId, req.body, { new: true })
      res.redirect(`/characters/${character.id}`)
  } catch (error) {
      res.render('error.ejs', { msg: error.message })
  }
})

// A route to delete a document in the collection 
app.delete('/characters/:characterId', isSignedIn, async (req, res) => {
  try {
      const character = await Characters.findByIdAndDelete(req.params.characterId)
      res.redirect('/characters')
  } catch (error) {
      res.render('error.ejs', { msg: error.message })
  }
})

// A route to the 'edit' page
app.get('/characters/:characterId/edit', isSignedIn, async (req, res) => {
  try {
      const character = await Characters.findById(req.params.characterId)
      res.render('edit.ejs', {
        character,
      })
  } catch (error) {
      res.render('error.ejs', { msg: error.message })
  }
})

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