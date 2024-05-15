const mongoose = require('mongoose')

const friendSchema = new mongoose.Schema({
    name: { type: String, required: true},
    actor: { type: String, required: true},
    episodes: { type: Number, required: true},
    occupation: { type: String, required: false}
})

module.exports = mongoose.model('Friend', friendSchema)