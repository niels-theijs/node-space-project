const mongoose = require('mongoose')

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

// Mongoose DB listeners
mongoose.connection.once('open', () => { // .once if the event only occurs once
    console.log('MongoDB Connected...')
})
mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}