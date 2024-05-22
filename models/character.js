const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema(
    {
    text: { type: String, required: true },
    reviewer: { type: mongoose.Schema.ObjectId, required: true, ref: "User" }
    }, 
    { timestamps: true }
)

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    actor: { type: String, required: true },
    episodes: { type: Number, required: true },
    occupation: { type: String, required: false },
    description: { type: String, required: true },
    image: { type: String, required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User"},
    quotes: [quoteSchema]
})

module.exports = mongoose.model('Character', characterSchema)

