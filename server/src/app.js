const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const api = require('./routes/api.v1/api.v1')

const app = express();

// Security related Middleware
app.use(cors({ // mounts the cors middleware
    origin: 'http://localhost:3000'
})); 
// Logging Middleware
app.use(morgan('combined'));
// Other Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routers
app.use('/v1', api);
// Load root route
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})


module.exports = app;