require('dotenv').config();
const mongoose = require('mongoose');

const Friends = require('./models/friends')

async function seed() {
    console.log('Seeding has begun! 🌱');
    mongoose.connect(process.env.MONGODB_URI)
    console.log('Connection successful! 🚀')

    const friend = await Friends.create({
        name: 'Ross Geller',
        actor: 'David Schwimmer',
        episodes: 236,
        occupation: 'Paleontologist'
    })
    console.log(friend)
    mongoose.disconnect()
}

seed()