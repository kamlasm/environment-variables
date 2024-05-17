// ! Require dependencies
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Characters = require('./models/characters')
const methodOverride = require("method-override")
const morgan = require("morgan")
const path = require('path')

//  ! Define port to use
const port = 3000;

// ! Connect to MongoDB via mongoose
mongoose.connect(process.env.MONGODB_URI)

//  ! Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json()) // expect JSON in request
app.use(express.urlencoded({ extended: false})) // expect data from our form
app.use(methodOverride('_method')) // to override requests in browser
app.use(morgan('dev')) // to log our HTTP requests

//  ! A route to render the homepage
app.get('/', (req, res) => {
  res.render('home.ejs');
});

// ! A route that gets ALL documents from the 'Friends' collection and renders on 'Characters' page
app.get('/characters', async (req, res) => {
  const characters = await Characters.find()
  res.render('characters.ejs', {
    characters,
  })
})

// ! Get one document from the 'Friends' collection using its Id and render it on a "show" page
app.get('/characters/:characterId', async (req, res) => {
  const character = await Characters.findById(req.params.characterId)
  res.render('show.ejs', {
    character,
  })
})

// ! A route which renders a page for the user to add new character
app.get('/new-character', (req, res) => {
  res.render('new.ejs')
})

// ! Creating (posting) a new character based on info submitted in form and display "show" page
app.post('/characters', async (req, res) => {
  const character = await Characters.create(req.body)
  res.redirect(`/characters/${character.id}`) //  redirect user once form is submitted
})

// ! Updating (putting) a document in the 'Friends' collection 
app.put('/characters/:characterId', async (req, res) => {
  const character = await Characters.findByIdAndUpdate(req.params.characterId, req.body, { new: true })
  res.redirect(`/characters/${character.id}`)
})

// ! Deleting a document in the 'Friends' collection 
app.delete('/characters/:characterId', async (req, res) => {
  const character = await Characters.findById(req.params.characterId)
  res.redirect('/characters')
})

// ! Get a route to the edit page 
app.get('/characters/:characterId/edit', async (req, res) => {
  const character = await Characters.findById(req.params.characterId)
  res.render('edit.ejs', {
    character,
  })
})

//  ! Run port to continuously listen for HTTP requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Your secret is ${process.env.SECRET_PASSWORD}`);
  console.log(`My mongo db uri is ${process.env.MONGODB_URI}`);
});
