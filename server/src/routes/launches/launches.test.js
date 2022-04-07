const request = require('supertest')
const app = require('../../app')
const mongo = require('../../utils/mongo')

const fullBody = {
    mission: "Andromeda VII",
    rocket: "INTEL IS3",
    launchDate: "January 14, 2030",
    target: "Kepler-62 f"
};
const bodyNoDate = {
    mission: "Andromeda VII",
    rocket: "INTEL IS3",
    target: "Kepler-62 f"
};

describe('Launches API', () => {
    beforeAll(async() => {
        await mongo.mongoConnect();
    });

    afterAll(async() => {
        await mongo.mongoDisconnect();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect(200)
                .expect('Content-Type', /json/) // // syntax is just js regex
        });
    });
    
    describe('Test POST /launch', () => {
        test('it should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(fullBody)
                .expect(201)
                .expect('Content-Type', /json/);
            expect(response.body).toMatchObject(bodyNoDate);
            expect(new Date(fullBody.launchDate).valueOf())
                .toBe(new Date(response.body.launchDate).valueOf());
        });
        test('it should catch missing required properties', async () => {
             const response = await request(app)
                .post('/v1/launches')
                .send(bodyNoDate)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body).toStrictEqual({error: 'missing input'});
        });
        test('it should catch invalid dates', async () => {
             const response = await request(app)
                .post('/v1/launches')
                .send({
                    mission: "Andromeda VII",
                    rocket: "INTEL IS3",
                    launchDate: "hey! you are not a date",
                    target: "Kepler-186 f"
                })
                .expect(400)
                .expect('Content-Type', /json/);
            expect(response.body).toStrictEqual({error: 'Invalid Date'});
        });
    });
});
