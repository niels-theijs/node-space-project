const launchesDB = require('./launches.mongo');
const planetsDB = require('./planets.mongo');
const axios = require('axios');

// create launch mongo
async function scheduleLaunch(data) {
    const flightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(data, {
        success: true,
        upcoming: true, 
        customers: ['ZTM', 'NASA'],
        flightNumber: flightNumber
    });
    await saveLaunch(newLaunch);
}

// save launch to mongo
async function saveLaunch(launch) {
    await launchesDB.findOneAndUpdate({ // check if flightnumber exists, if it does not exist, add launch. set upsert to true
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

// get latest flight number mongo
async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB.findOne().sort('-flightNumber') // minus flightNumber because we want descending
    if (latestLaunch) {
        return latestLaunch.flightNumber;
    } else {
        return 0;
    }
}

// Retrieve launches
async function getAllLaunches(skip, limit) {
    return await launchesDB
        .find({}, { '_id': 0, "__v": 0 })
        .sort({flightNumber: 1}) // -1 for desc
        .skip(skip)
        .limit(limit);
};

async function getSpaceXLaunches() {
    const response =  await axios.post("https://api.spacexdata.com/v4/launches/query", {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    const launchDocs = response.data.docs;
    const spaceXLoaded = await findLaunch({
        mission: 'FalconSat'
    })
    if (spaceXLoaded) {
        console.log('skipping spaceX load - already exists');
        return;
    }
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers
        }
        await saveLaunch(launch)
    }
}

async function findLaunch(filter) {
    return await launchesDB.findOne(filter);
}

// Delete Launches
async function existsLaunchId(launchId) {
    return await findLaunch({
        flightNumber: launchId
    });
}

async function abortLaunch(launchId) {
    const aborted = await launchesDB.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });
    return aborted.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    existsLaunchId,
    abortLaunch,
    scheduleLaunch,
    getSpaceXLaunches,
}