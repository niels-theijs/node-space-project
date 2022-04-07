const express = require('express');

const launchesController = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', launchesController.getAllLaunches);
launchesRouter.post('/', launchesController.createNewLaunch);
launchesRouter.delete('/:id', launchesController.abortLaunch);

module.exports = launchesRouter;