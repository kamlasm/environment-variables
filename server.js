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

//  Define port to use
const port = 3000;

// Connect to MongoDB via mongoose
mongoose.connect(process.env.MONGODB_URI)

//  Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json()) // expect JSON in request
app.use(express.urlencoded({ extended: false})) // expect data from our form
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

// Use the auth controller for any requests that start with /auth
app.use('/auth', authController)

//  A route to render the homepage
app.get('/', (req, res) => {
  res.render('home.ejs', {
    user: req.session.user
  });
});

// A route that gets ALL documents from the collection and renders on 'Characters' page
app.get('/characters', async (req, res) => {
  const characters = await Characters.find()
  res.render('characters.ejs', {
    characters,
    user: req.session.user
  })
})

// A route that gets ONE document from the collection using its Id and renders it on a 'show' page
app.get('/characters/:characterId', async (req, res) => {
  const character = await Characters.findById(req.params.characterId)
  res.render('show.ejs', {
    character,
    user: req.session.user
  })
})

// A route that renders a page for the user to add a new character
app.get('/new-character', (req, res) => {
  res.render('new.ejs', {
    user: req.session.user
  })
})

// A route that creates (POSTs) a new character based on info submitted in form
app.post('/characters', async (req, res) => {
  const character = await Characters.create(req.body)
// Redirects the user to a new'show' page for that character
  res.redirect(`/characters/${character.id}`) 
})

// A route to update (PUT) a document in the collection 
app.put('/characters/:characterId', async (req, res) => {
  const character = await Characters.findByIdAndUpdate(req.params.characterId, req.body, { new: true })
  res.redirect(`/characters/${character.id}`)
})

// A route to delete a document in the collection 
app.delete('/characters/:characterId', async (req, res) => {
  if (req.session.user) {
    const character = await Characters.findByIdAndDelete(req.params.characterId)
    res.redirect('/characters')
  } else {
      res.send('You must be logged in to delete a character.')
  }

})

// A route to the 'edit' page
app.get('/characters/:characterId/edit', async (req, res) => {
  const character = await Characters.findById(req.params.characterId)
  res.render('edit.ejs', {
    character,
    user: req.session.user
  })
})

//  Run port to continuously listen for HTTP requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Your secret is ${process.env.SECRET_PASSWORD}`);
  console.log(`My mongo db uri is ${process.env.MONGODB_URI}`);
});