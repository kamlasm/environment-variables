require('dotenv').config();
const mongoose = require('mongoose');
const Characters = require('./models/characters')

async function seed() {
    console.log('Seeding has begun! 🌱');
    mongoose.connect(process.env.MONGODB_URI)
    console.log('Connection successful! 🚀')

    const Character = await Characters.create({
        name: 'Ross Geller',
        actor: 'David Schwimmer',
        episodes: 236,
        occupation: 'Paleontologist',
        description: 'tbc',
        image: 'ross.png'
    })
    
    mongoose.disconnect()
}

seed()