const mongoose = require('mongoose')

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    actor: { type: String, required: true },
    episodes: { type: Number, required: true },
    occupation: { type: String, required: false },
    description: { type: String, required: true },
    image: { type: String, required: true },
})

module.exports = mongoose.model('Character', characterSchema)

