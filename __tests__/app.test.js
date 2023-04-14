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
        expect(reviews.length).toBe(13);
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
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
  test("200, accepts a category query and responds with the reviews within that category", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        expect(reviews.length).toBe(11);
        reviews.forEach((review) => {
          expect(review).toHaveProperty("title", expect.any(String));
          expect(review).toHaveProperty("designer", expect.any(String));
          expect(review).toHaveProperty("owner", expect.any(String));
          expect(review).toHaveProperty("review_img_url", expect.any(String));
          expect(review).toHaveProperty("review_body", expect.any(String));
          expect(review).toHaveProperty("category", "social deduction");
          expect(review).toHaveProperty("created_at");
          expect(review).toHaveProperty("votes", expect.any(Number));
          expect(review).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
  test("200, responds with an empty array when queried with a category that exists but has no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        expect(reviews.length).toBe(0);
      });
  });
  test("200, accepts a sort_by query and sorts the reviews by any valid column, order is descending as default", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        expect(reviews.length).toBe(13);
        expect(reviews).toBeSortedBy("owner", {
          descending: true,
        });
      });
  });
  test("200, accepts a order query and orders the reviews accordingly, sorts by date as default", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        expect(reviews.length).toBe(13);
        expect(reviews).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("200, accepts a sort_by, order and category query and arranges the data accordingly", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner&order=asc&category=social deduction")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        expect(reviews.length).toBe(11);
        expect(reviews).toBeSortedBy("owner", {
          descending: false,
        });
      });
  });
  test("400, responds with error when passed an invalid sort query", () => {
    return request(app)
      .get("/api/reviews?sort_by=date")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid sort query");
      });
  });
  test("400, responds with bad request when queried with a category that is not in the database", () => {
    return request(app)
      .get("/api/reviews?category=not-a-category")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("No review found");
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
        expect(review).toHaveProperty("comment_count", 0);
      });
  });
  test("200, responds with a review object based on the review_id parametric endpoint, includes a comment count", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((res) => {
        const { review } = res.body;
        expect(review).toHaveProperty("comment_count", 3);
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

describe("POST /api/reviews/:review_id/comments", () => {
  test("201, responds with the posted comment", () => {
    const commentToAdd = { username: "mallionaire", body: "Great game!" };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(commentToAdd)
      .expect(201)
      .then((res) => {
        const { comment } = res.body;
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("body", "Great game!");
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("author", "mallionaire");
        expect(comment).toHaveProperty("review_id", 4);
        expect(comment).toHaveProperty("created_at");
      });
  });
  test("201, responds with the posted comment, ignores unnecessary property", () => {
    const commentToAdd = {
      username: "mallionaire",
      body: "Great game!",
      votes: 50,
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(commentToAdd)
      .expect(201)
      .then((res) => {
        const { comment } = res.body;
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("body", "Great game!");
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("author", "mallionaire");
        expect(comment).toHaveProperty("review_id", 4);
        expect(comment).toHaveProperty("created_at");
      });
  });
  test("400, responds with bad request when passed an incomplete comment input", () => {
    const commentToAdd = { username: "mallionaire" };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(commentToAdd)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request - incomplete information");
      });
  });
  test("400, responds with bad request when passed an incomplete comment input", () => {
    const commentToAdd = { body: "Great game!" };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(commentToAdd)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request - incomplete information");
      });
  });
  test("404, responds not found when a username does not exist", () => {
    const commentToAdd = {
      username: "non-existent-username",
      body: "Great game!",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(commentToAdd)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("400, responds with bad request when passed an invalid review_id", () => {
    const commentToAdd = {
      username: "mallionaire",
      body: "Great game!",
    };
    return request(app)
      .post("/api/reviews/not-a-number/comments")
      .send(commentToAdd)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("404, responds with not found when passed a valid but non existant review_id", () => {
    const commentToAdd = {
      username: "mallionaire",
      body: "Great game!",
    };
    return request(app)
      .post("/api/reviews/1000/comments")
      .send(commentToAdd)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
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

describe("GET /api/users", () => {
  test("200, responds with an array of all of the user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const { users } = res.body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
        expect(users[1]).toMatchObject({
          username: "philippaclaire9",
          name: "philippa",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200, responds with an updated review with an updated vote count", () => {
    const voteInput = { inc_votes: 5 };
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
        expect(review).toHaveProperty("votes", 6);
      });
  });
  test("200, responds with an updated review with an updated negative vote count", () => {
    const voteInput = { inc_votes: -100 };
    return request(app)
      .patch("/api/reviews/2")
      .send(voteInput)
      .expect(200)
      .then((res) => {
        const { review } = res.body;
        expect(review).toHaveProperty("review_id", 2);
        expect(review).toHaveProperty("title", "Jenga");
        expect(review).toHaveProperty("designer", "Leslie Scott");
        expect(review).toHaveProperty("owner", "philippaclaire9");
        expect(review).toHaveProperty(
          "review_img_url",
          "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700"
        );
        expect(review).toHaveProperty(
          "review_body",
          "Fiddly fun for all the family"
        );
        expect(review).toHaveProperty("category", "dexterity");
        expect(review).toHaveProperty("created_at");
        expect(review).toHaveProperty("votes", -95);
      });
  });
  test("200, responds with an updated review and ignores any unnecessary properties", () => {
    const voteInput = { inc_votes: 7, review_id: 7, title: "Jenga" };
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
        expect(review).toHaveProperty("votes", 8);
      });
  });
  test("200, responds with the unchanged review when input information is not provided", () => {
    const voteInput = {};
    return request(app)
      .patch("/api/reviews/2")
      .send(voteInput)
      .expect(200)
      .then((res) => {
        const { review } = res.body;
        expect(review).toHaveProperty("review_id", 2);
        expect(review).toHaveProperty("title", "Jenga");
        expect(review).toHaveProperty("designer", "Leslie Scott");
        expect(review).toHaveProperty("owner", "philippaclaire9");
        expect(review).toHaveProperty(
          "review_img_url",
          "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700"
        );
        expect(review).toHaveProperty(
          "review_body",
          "Fiddly fun for all the family"
        );
        expect(review).toHaveProperty("category", "dexterity");
        expect(review).toHaveProperty("created_at");
        expect(review).toHaveProperty("votes", 5);
      });
  });
  test("400, responds with bad request when passed an invalid review_id", () => {
    return request(app)
      .patch("/api/reviews/not-a-path")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("404, responds with not found when passed a valid review_id but the review_id does not exist", () => {
    return request(app)
      .patch("/api/reviews/1000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No review found for review 1000");
      });
  });
  test("400, responds with bad request when passed the wrong data type", () => {
    const voteInput = { inc_votes: "not-a-number" };
    return request(app)
      .patch("/api/reviews/1")
      .send(voteInput)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204, responds with a status 204 and no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((res) => {
        expect(res.body).toEqual({});
        return request(app).get("/api/comments/1").expect(404);
      });
  });
  test("404, responds with not found when passed a valid comment_id but the comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No comment found for comment 1000");
      });
  });
  test("400, responds with bad request when passed the wrong data type", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api", () => {
  test("responds with JSON of all endpoints", () => {
    return request(app)
      .get("/api")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/categories": {
            description: "serves an array of all categories",
            exampleResponse: {
              categories: [
                {
                  description:
                    "Players attempt to uncover each other's hidden role",
                  slug: "Social deduction",
                },
              ],
            },
          },
          "GET /api/reviews": {
            description:
              "serves an array of all review objects, displays all reviews if category value is omitted, sorts by any valid column (defaults to date), order can be set to asc or desc (defaults to desc)",
            queries: ["category", "sort_by", "order"],
            exampleResponse: {
              reviews: [
                {
                  review_id: 13,
                  title: "Kerplunk; Don't lose your marbles",
                  category: "dexterity",
                  designer: "Avery Wunzboogerz",
                  owner: "tickle122",
                  review_body:
                    "Don't underestimate the tension and supsense that can be brought on with a round of Kerplunk! You'll feel the rush and thrill of not disturbing the stack of marbles, and probably utter curse words when you draw the wrong straw. Fanily friendly, and not just for kids! ",
                  review_img_url:
                    "https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg?w=700&h=700",
                  created_at: "2021-01-25T11:16:54.963Z",
                  votes: -14,
                  comment_count: 72,
                },
              ],
            },
          },
          "GET /api/reviews/:review_id": {
            description:
              "serves a review object based on the parametric endpoint",
            exampleResponse: {
              review: {
                review_id: 12,
                title: "Occaecat consequat officia in quis commodo.",
                category: "roll-and-write",
                designer: "Ollie Tabooger",
                owner: "happyamy2016",
                review_body:
                  "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.",
                review_img_url:
                  "https://images.pexels.com/photos/6333934/pexels-photo-6333934.jpeg?w=700&h=700",
                created_at: "2020-09-13T15:19:28.077Z",
                votes: 8,
                comment_count: 1,
              },
            },
          },
          "GET /api/reviews/:review_id/comments": {
            description:
              "serves an array of comments based on the selected review",
            exampleResponse: {
              comments: [
                {
                  comment_id: 19,
                  body: "Quis duis mollit ad enim deserunt.",
                  review_id: 3,
                  author: "jessjelly",
                  votes: 3,
                  created_at: "2021-03-27T19:48:58.110Z",
                },
                {
                  comment_id: 20,
                  body: "Laboris nostrud ea ex occaecat aute quis consectetur anim.",
                  review_id: 3,
                  author: "cooljmessy",
                  votes: 17,
                  created_at: "2021-03-27T14:15:38.110Z",
                },
              ],
            },
          },
          "POST /api/reviews/:review_id/comments": {
            description: "creates a new comment object",
            exampleRequest: { username: "mallionaire", body: "Great game!" },
            exampleResponse: {
              comment: {
                comment_id: 1,
                body: "Great game!",
                votes: 0,
                author: "mallionaire",
                review_id: 4,
                created_at: "2020-09-13T15:19:28.077Z",
              },
            },
          },
          "PATCH /api/reviews/:review_id": {
            description:
              "increments or decrements the vote count of a review by the specified value",
            exampleRequest: { inc_votes: 5 },
            exampleResponse: {
              review: {
                review_id: 3,
                title: "Karma Karma Chameleon",
                category: "hidden-roles",
                designer: "Rikki Tahta",
                owner: "happyamy2016",
                review_body:
                  "Try to trick your friends. If you find yourself being dealt the Chamelean card then the aim of the game is simple; blend in... Meanwhile the other players aim to be as vague as they can to not give the game away ",
                review_img_url:
                  "https://images.pexels.com/photos/45868/chameleon-reptile-lizard-green-45868.jpeg?w=700&h=700",
                created_at: "2021-01-18T10:01:42.151Z",
                votes: 5,
                comment_count: 5,
              },
            },
          },
          "GET /api/users": {
            description: "serves an array of all users",
            exampleResponse: {
              users: [
                {
                  username: "tickle122",
                  name: "Tom Tickle",
                  avatar_url:
                    "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
                },
              ],
            },
          },
          "DELETE /api/comments/:comment_id": {
            description: "deletes the given comment by comment id",
            exampleResponse: {},
          },
        });
      });
  });
});

afterAll(() => connection.end());
