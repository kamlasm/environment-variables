const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user.js')
let prevUrl

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs', {      
    })
})

router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username})
    
        if (userInDatabase) {
            throw new Error('Username already taken. Please try a different username.')
        }
    
        if (req.body.password !== req.body.confirmPassword) {
            throw new Error('Passwords don\'t match. Please try again.')
        }
    
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        req.body.password = hashedPassword
    
        const user = await User.create(req.body)
    
        // Automatic sign in after sign up
        req.session.user = {
            username: user.username,
        }
    
        req.session.save(() => {
            res.redirect('/')
        })
    } catch (error) {
        res.render('auth/sign-up.ejs', { msg: error.message })
    }
})

router.get('/sign-in', (req, res) => {
    // If user was redirected to sign-in page, store URL user tried to access 
    prevUrl = req.query.redirectUrl
    res.render('auth/sign-in.ejs', {    
    })
})

router.post('/sign-in', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username })

        if (!userInDatabase) {
            throw new Error('Login failed. Please try again.')
        }
    
        const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password) 
    
        if (!validPassword) {
            throw new Error('Login failed. Please try again.')
        }
    
        req.session.user = {
            username: userInDatabase.username,
            // Add user Id from Mongo DB to session cookie
            userId: userInDatabase._id
        }
        
        req.session.save(() => {
        // If user was trying to access protected page send user back to that page, else send to homepage
            if (prevUrl) {
            res.redirect(`${prevUrl}`)
            } else {
                res.redirect('/')
            } 
        })
    } catch (error) {
        res.render('auth/sign-in.ejs', { msg: error.message })
    }
})

router.get('/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

module.exports = router