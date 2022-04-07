const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse');

const planets = require('./planets.mongo')

function habitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > .36
    && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

// note: because streams are async, we need to wrap it as a promise so it waits for all data before moving on.
function loadPlanetsData () {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'keppler-data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (habitable(data)) {
                planetToDatabase(data);
            }
        })
        .on('error', (err) => {
            console.log('An error has occured\n', err);
            reject(err);
        })
        .on('end', async () => {
            const numPlanets = (await getAllPlanets()).length;
            console.log(numPlanets, ' planets found');
            resolve();
        })
    })
}

async function planetToDatabase(data) {
    try {
        await planets.updateOne({ // this will only change the data if it doesn't already exist
            kepler_name: data.kepler_name,
        }, {
            kepler_name: data.kepler_name,
        }, {
            upsert: true,
        });
    } catch (err) {
        console.error(`unable to save planet: ${err}`)
    }
}

async function getAllPlanets() {
    // return results
    return await planets.find({}, {
        '_id': 0, // 0 to exclude item, 1 to include item
        '__v': 0
    });

}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};