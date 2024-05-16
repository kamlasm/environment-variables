require('dotenv').config();
const express = require('express');
// ! Require mongoose
const mongoose = require('mongoose')
// ! Require model
const Characters = require('./models/characters')
const port = 3000;

const app = express();
app.use(express.static('public'))

// ! Connect to MongoDB via mongoose
mongoose.connect(process.env.MONGODB_URI)

app.get('/', (req, res) => {
  res.render('home.ejs');
});

// ! A route that gets ALL documents from the 'Friends' collection and sends this back to our client
app.get('/characters', async (req, res) => {
  const characters = await Characters.find()
  res.render('characters.ejs', {
    characters,
  })
})

// ! Get one document from the 'Friends' collection using its Id and send response back to the client
app.get('/characters/:characterId', async (req, res) => {
  const character = await Characters.findById(req.params.characterId)
  res.render('profile.ejs', {
    character,
  })
})

// ! Tell express to expect some json in the request
app.use(express.json())

// ! Posting a new document to the 'Friends' collection and send it back to the client
app.post('/characters', async (req, res) => {
  const character = await Characters.create(req.body)
  res.send(character)
})

// ! Updating (putting) a document in the 'Friends' collection and send response back to the client
app.put('/characters/:characterId', async (req, res) => {
  const characterId = req.params.characterId
  const character = await Characters.findByIdAndUpdate(characterId, req.body, { new: true })
  res.send(character)
})

// ! Deleting a document in the 'Friends' collection and send response back to the client
app.delete('/characters/:characterId', async (req, res) => {
  const characterId = req.params.characterId
  const character = await Characters.findByIdAndDelete(characterId)
  res.send(character)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Your secret is ${process.env.SECRET_PASSWORD}`);
  console.log(`My mongo db uri is ${process.env.MONGODB_URI}`);
});
