const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");

const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));

describe("bad paths", () => {
  test("404, responds with path not found in a unavailable path is requested", () => {
    return request(app)
      .get("/bad-path-entered")
      .expect(404)
      .then((res) => {
        const { msg } = res.body;
        expect(msg).toBe("Path not found");
      });
  });
});
describe("GET /api/categories", () => {
  test("200, responds with an array of category objects containing slug and description properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        const { categories } = res.body;
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("200, responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        reviews.forEach((review) => {
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("title");
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("review_img_url");
          expect(review).toHaveProperty("created_at");
          expect(review).toHaveProperty("votes");
          expect(review).toHaveProperty("designer");
          expect(review).toHaveProperty("comment_count");
        });
      });
  });
  test("200, the comment_count property has the total count of all the comments with this review_id", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        reviews.forEach((review) => {
          if (review.review_id === 1) {
            expect(review.comment_count).toBe(0);
          }
          if (review.review_id === 2) {
            expect(review.comment_count).toBe(3);
          }
          if (review.review_id === 3) {
            expect(review.comment_count).toBe(3);
          }
        });
      });
  });
  test("200, responds with the reviews sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

afterAll(() => connection.end());
