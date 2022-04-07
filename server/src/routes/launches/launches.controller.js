const launchesModel = require('../../models/launches.model');
const queryUtils = require('../../utils/query')

async function getAllLaunches(req, res) {
    const {skip, limit} = await queryUtils.getPagination(req.query);
    return res.status(200).json(await launchesModel.getAllLaunches(skip, limit));
}

async function createNewLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission  || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({error: 'missing input'});
    }
    
    launch.launchDate = new Date(launch.launchDate)
    if (launch.launchDate.toString() === 'Invalid Date') {
        return res.status(400).json({error: 'Invalid Date'});
    }


    await launchesModel.scheduleLaunch(launch);
    return res.status(201).json(launch);
}

async function abortLaunch(req, res) {
    const launchId = +req.params.id;

    const existsLaunch = await launchesModel.existsLaunchId(launchId)
    if (!existsLaunch) {
        return res.status(404).json({
            error: "launch not found"
        });
    }
    const aborted = await launchesModel.abortLaunch(launchId);
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted'
        })
    }
    return res.status(200).json({
        error: 'Launch aborted'
    });

}

module.exports = {
    getAllLaunches,
    createNewLaunch,
    abortLaunch,
}