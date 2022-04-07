const express = require('express');

// import controllers
const planetsController = require('./planets.controller');

// init router
const planetsRouter = express.Router();

planetsRouter.get('/', planetsController.getAllPlanets);

module.exports = planetsRouter;