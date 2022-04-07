require('dotenv').config(); // configure env variables

const http = require('http')
const mongo = require('./utils/mongo')

const app = require('./app') 
const planetsModel = require('./models/planets.model');
const launchesModel = require('./models/launches.model')

const PORT = process.env.PORT || 4001; // Front runs on 3000 - port will either be the environment variable set or default to 4000

const server = http.createServer(app); // by using both http and using express on ./app will allow us more advanced/other connections and will also allow us to separate the express code.

// await can only be used in async function so below can be wrapped in an async function
// because async function runs asynchronously, we also need to add in the server.listen so it waits for the planets data to load.
async function startServer() {
    await mongo.mongoConnect();
    await planetsModel.loadPlanetsData(); // load this data on startup

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();