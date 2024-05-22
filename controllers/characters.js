const express = require('express')
const router = express.Router()
const Characters = require('../models/character.js')
const isSignedIn = require('../middleware/is-signed-in.js')

// A route that gets ALL documents from the collection and renders on 'Characters' page
router.get('/', async (req, res) => {
    try {
        const characters = await Characters.find()
        res.render('characters.ejs', {
        characters,
        })
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
  })
  
  // A route that renders a page for the user to add a new character
  router.get('/new-character', isSignedIn, (req, res) => {
    res.render('new.ejs', {
    })
  })
  
  // A route that gets ONE document from the collection using its Id and renders it on a 'show' page
  router.get('/:characterId', async (req, res) => {
    try {
        const character = await Characters.findById(req.params.characterId)
        res.render('show.ejs', {
          character,
        })
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
  })
  
 // A route that creates (POSTs) a new character based on info submitted in form
  router.post('/', async (req, res) => {
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
  router.put('/:characterId', async (req, res) => {
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
  router.delete('/:characterId', isSignedIn, async (req, res) => {
    try {
        const character = await Characters.findByIdAndDelete(req.params.characterId)
        res.redirect('/characters')
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
  })
  
  // A route to the 'edit' page
  router.get('/:characterId/edit', isSignedIn, async (req, res) => {
    try {
        const character = await Characters.findById(req.params.characterId)
        res.render('edit.ejs', {
          character,
        })
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
  })

module.exports = router