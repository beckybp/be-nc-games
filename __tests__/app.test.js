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

describe("GET /api/reviews/:review_id", () => {
  test("200, responds with a review object based on the review_id parametric endpoint", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then((res) => {
        const { review } = res.body;
        expect(review).toHaveProperty("review_id", 4);
        expect(review).toHaveProperty("title", "Dolor reprehenderit");
        expect(review).toHaveProperty("category", "social deduction");
        expect(review).toHaveProperty("designer", "Gamey McGameface");
        expect(review).toHaveProperty("owner", "mallionaire");
        expect(review).toHaveProperty(
          "review_body",
          "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod"
        );
        expect(review).toHaveProperty(
          "review_img_url",
          "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700"
        );
        expect(review).toHaveProperty("created_at", "2021-01-22T11:35:50.936Z");
        expect(review).toHaveProperty("votes", 7);
      });
  });
  test("404, returns not found when passed a valid endpoint but the endpoint does not exist", () => {
    return request(app)
      .get("/api/reviews/100")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No review found for review 100");
      });
  });
  test("400, returns bad request when passed an invalid endpoint", () => {
    return request(app)
      .get("/api/reviews/notAnId")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200, responds with an array of comments for a given review_id", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments.length).toBe(3);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("review_id");
        });
      });
  });
  test("200, responds with the most recent comments first", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("400, returns bad request when passed an invalid review_id", () => {
    return request(app)
      .get("/api/reviews/not-a-path/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("404, returns not found when passed a valid review_id but the review_id does not exist", () => {
    return request(app)
      .get("/api/reviews/1000/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No review found for review 1000");
      });
  });
  test("200, responds with an empty array of comments when passed a valid review_id that exists that has no comments", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments.length).toBe(0);
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200, responds with an updated review", () => {
    const voteInput = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/1")
      .send(voteInput)
      .expect(200)
      .then((res) => {
        const { review } = res.body;
        expect(review).toHaveProperty("review_id", 1);
        expect(review).toHaveProperty("title", "Agricola");
        expect(review).toHaveProperty("designer", "Uwe Rosenberg");
        expect(review).toHaveProperty("owner", "mallionaire");
        expect(review).toHaveProperty(
          "review_img_url",
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
        );
        expect(review).toHaveProperty("review_body", "Farmyard fun!");
        expect(review).toHaveProperty("category", "euro game");
        expect(review).toHaveProperty("created_at");
        expect(review).toHaveProperty("votes", 2);
      });
  });
});

afterAll(() => connection.end());
