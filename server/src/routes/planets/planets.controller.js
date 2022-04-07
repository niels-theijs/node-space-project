const planetsModel = require('../../models/planets.model');

async function getAllPlanets(req, res) {
    return res.status(200).json(await planetsModel.getAllPlanets()); // return is to avoid sending more than one response
}

module.exports = {
    getAllPlanets
}