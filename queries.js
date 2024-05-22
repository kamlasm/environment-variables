const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Characters = require('./models/character.js');

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  await runQueries()

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
  process.exit();
};

connect()

// Remove a quote
const removeQuote = async () => {
    const rossId = '66463177f1f4fc365f084d5f'
    const quote = '664e1362b89369e9c803ad57'
    
    const ross = await Characters.findById(rossId)
    ross.quotes.pull(quote)
    await ross.save()

    console.log('updated doc', ross)
}

// Run queries
const runQueries = async () => {
    console.log('Queries running.');
    await removeQuote();
  };