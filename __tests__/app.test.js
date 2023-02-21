const request = require('supertest');
const app = require('../app.js')
const connection = require('../db/connection.js')

const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');

beforeEach(() => seed(testData));

describe('GET /api/categories', () => {
    test('status:200, responds with an array of category objects containing slug and description properties', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then((res) => {
                const { categories } = res.body;
                expect(categories).toHaveLength(4)
                categories.forEach((category) => {
                    expect(category).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
    })
})

afterAll(() => connection.end())