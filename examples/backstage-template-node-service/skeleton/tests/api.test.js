const request = require("supertest");
const app = require("../src/index");

describe("BACKSTAGE_ENTITY_NAME API", () => {
  describe("GET /", () => {
    test("should return service information with API endpoints", async () => {
      const response = await request(app)
        .get("/")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("service", "BACKSTAGE_ENTITY_NAME");
      expect(response.body).toHaveProperty(
        "message",
        "Welcome to the Memes API"
      );
      expect(response.body).toHaveProperty("endpoints");
      expect(response.body).toHaveProperty("memeEndpoints");
      expect(response.body.endpoints).toHaveProperty("memes", "/api/memes");
    });
  });

  describe("GET /health", () => {
    test("should return health status", async () => {
      const response = await request(app)
        .get("/health")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("service", "BACKSTAGE_ENTITY_NAME");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("version");
    });
  });

  describe("GET /api/hello", () => {
    test("should return hello message", async () => {
      const response = await request(app)
        .get("/api/hello")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Hello from BACKSTAGE_ENTITY_NAME!"
      );
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/status", () => {
    test("should return service status", async () => {
      const response = await request(app)
        .get("/api/status")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("service", "BACKSTAGE_ENTITY_NAME");
      expect(response.body).toHaveProperty("status", "running");
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("memory");
      expect(response.body).toHaveProperty("environment");
    });
  });

  describe("Memes API", () => {
    describe("GET /api/memes", () => {
      test("should return list of memes", async () => {
        const response = await request(app)
          .get("/api/memes")
          .expect("Content-Type", /json/)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(2); // Default memes

        const firstMeme = response.body[0];
        expect(firstMeme).toHaveProperty("id");
        expect(firstMeme).toHaveProperty("title");
        expect(firstMeme).toHaveProperty("description");
        expect(firstMeme).toHaveProperty("imageUrl");
        expect(firstMeme).toHaveProperty("category");
        expect(firstMeme).toHaveProperty("likes");
        expect(firstMeme).toHaveProperty("views");
      });
    });

    describe("GET /api/memes/:id", () => {
      test("should return specific meme by id", async () => {
        const response = await request(app)
          .get("/api/memes/1")
          .expect("Content-Type", /json/)
          .expect(200);

        expect(response.body).toHaveProperty("id", 1);
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("imageUrl");
      });

      test("should return 404 for non-existent meme", async () => {
        const response = await request(app)
          .get("/api/memes/999")
          .expect("Content-Type", /json/)
          .expect(404);

        expect(response.body).toHaveProperty("error", "Not found");
      });
    });

    describe("POST /api/memes", () => {
      test("should create new meme", async () => {
        const newMeme = {
          title: "Funny Cat Meme",
          description: "A hilarious cat reaction meme",
          imageUrl: "https://example.com/cat-meme.jpg",
          category: "cats",
          tags: ["funny", "cats", "reaction"],
          likes: 0,
          views: 0,
        };

        const response = await request(app)
          .post("/api/memes")
          .send(newMeme)
          .expect("Content-Type", /json/)
          .expect(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("title", "Funny Cat Meme");
        expect(response.body).toHaveProperty("category", "cats");
        expect(response.body).toHaveProperty("likes", 0);
        expect(response.body).toHaveProperty("createdAt");
        expect(response.body).toHaveProperty("updatedAt");
      });

      test("should return validation error for missing required fields", async () => {
        const invalidMeme = {
          title: "", // Empty title
          description: "Test description",
          imageUrl: "", // Empty imageUrl
          category: "test",
          likes: -10, // Invalid likes
          views: -5, // Invalid views
        };

        const response = await request(app)
          .post("/api/memes")
          .send(invalidMeme)
          .expect("Content-Type", /json/)
          .expect(400);

        expect(response.body).toHaveProperty("error", "Validation failed");
        expect(response.body).toHaveProperty("details");
        expect(Array.isArray(response.body.details)).toBe(true);
      });
    });

    describe("PUT /api/memes/:id", () => {
      test("should update existing meme", async () => {
        const updatedData = {
          title: "Updated Funny Meme",
          description: "Updated description for meme",
          imageUrl: "https://example.com/updated-meme.jpg",
          category: "Updated",
          tags: ["updated", "funny"],
          likes: 500,
          views: 2000,
        };

        const response = await request(app)
          .put("/api/memes/1")
          .send(updatedData)
          .expect("Content-Type", /json/)
          .expect(200);

        expect(response.body).toHaveProperty("id", 1);
        expect(response.body).toHaveProperty("title", "Updated Funny Meme");
        expect(response.body).toHaveProperty("likes", 500);
        expect(response.body).toHaveProperty("updatedAt");
      });

      test("should return 404 for non-existent meme", async () => {
        const updatedData = {
          title: "Updated Name",
          description: "Updated description",
          imageUrl: "https://example.com/meme.jpg",
          category: "updated",
          tags: ["updated"],
          likes: 10,
          views: 100,
        };

        const response = await request(app)
          .put("/api/memes/999")
          .send(updatedData)
          .expect("Content-Type", /json/)
          .expect(404);

        expect(response.body).toHaveProperty("error", "Not found");
      });
    });

    describe("DELETE /api/memes/:id", () => {
      test("should delete meme", async () => {
        // First create a meme to delete
        const newMeme = {
          title: "Test Meme for Deletion",
          description: "This will be deleted",
          imageUrl: "https://example.com/delete-test.jpg",
          category: "test",
          tags: ["test", "delete"],
          likes: 0,
          views: 0,
        };

        const createResponse = await request(app)
          .post("/api/memes")
          .send(newMeme)
          .expect(201);

        const memeId = createResponse.body.id;

        // Now delete it
        await request(app).delete(`/api/memes/${memeId}`).expect(204);

        // Verify it's gone
        await request(app).get(`/api/memes/${memeId}`).expect(404);
      });

      test("should return 404 for non-existent meme", async () => {
        const response = await request(app)
          .delete("/api/memes/999")
          .expect("Content-Type", /json/)
          .expect(404);

        expect(response.body).toHaveProperty("error", "Not found");
      });
    });
  });

  describe("GET /nonexistent", () => {
    test("should return 404 for non-existent routes", async () => {
      const response = await request(app)
        .get("/nonexistent")
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toHaveProperty("error", "Not Found");
    });
  });
});
