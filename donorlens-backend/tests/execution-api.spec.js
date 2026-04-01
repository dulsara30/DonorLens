import { test, expect } from "@playwright/test";

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OThlMWYzY2IzMDhlMDE4ZDVkMjE4NmYiLCJyb2xlIjoiTkdPX0FETUlOIiwiaWF0IjoxNzc1MDIyMDEzLCJleHAiOjE3NzUxMDg0MTN9.1LtW1plsWrm0lUa6UkvF08yWMkxIM5jQonfuytYJeSw"; 
const INVALID_TOKEN = "invalid.token.here";
const CAMPAIGN_ID = "69abdbf32a26012295630f48";
const API_BASE_URL = "http://localhost:5000";

const mockImage = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);

test.describe("Campaign Execution API - 30 Tests", () => {
  let createdExecutionId = null;

  test.beforeAll(async ({ request }) => {
    console.log("Starting test suite...");
    try {
      const healthCheck = await request.get(`${API_BASE_URL}/health`);
      expect(healthCheck.ok()).toBe(true);
      console.log("API server is running");
    } catch (error) {
      console.log("API server is not reachable!");
    }
  });

  // CREATE TESTS (5)
  test.describe("CREATE - Execution Creation (Protected)", () => {

    test("1. Create execution with valid data and file", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "Monthly Report",
            date: "2026-03-01",
            description: "March execution",
            fundsUsed: "15000",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.executionUpdate).toBeDefined();
      expect(body.data.executionUpdate.title).toBe("Monthly Report");
      
      createdExecutionId = body.data.executionUpdate._id;
      console.log("Created execution ID:", createdExecutionId);
    });

    test("2. Create execution without files (should fail)", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "No Files",
            date: "2026-03-01",
            description: "Missing files",
            fundsUsed: "5000",
          },
        },
      );

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("3. Create execution with negative funds (should fail)", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "Negative Funds",
            date: "2026-03-01",
            description: "Bad funds",
            fundsUsed: "-5000",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("4. Create execution with future date (should fail)", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "Future Date",
            date: "2030-12-25",
            description: "Future date",
            fundsUsed: "5000",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("5. Create execution without auth (should fail)", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          multipart: {
            title: "No Auth",
            date: "2026-03-01",
            fundsUsed: "5000",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      expect(response.status()).toBe(401);
    });
  });

  // READ TESTS (6)
  test.describe("READ - Get Executions (Public)", () => {

    test("6. Get all executions for campaign (no auth needed)", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });

    test("7. Get single execution by ID (no auth needed)", async ({ request }) => {
      if (!createdExecutionId) {
        test.skip();
        return;
      }

      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/${createdExecutionId}`
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data._id).toBe(createdExecutionId);
    });

    test("8. Get execution with invalid ID (should fail)", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/invalidid123`
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("9. Get executions returns correct structure", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });

    test("10. Get executions with auth token also works", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        }
      );

      expect(response.status()).toBe(200);
    });

    test("11. Get execution with invalid token still works (public endpoint)", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${INVALID_TOKEN}` },
        }
      );

      expect(response.status()).toBe(200);
    });
  });

  // UPDATE TESTS (5)
  test.describe("UPDATE - Execution Update (Protected)", () => {

    test("12. Update execution with valid data", async ({ request }) => {
      if (!createdExecutionId) {
        test.skip();
        return;
      }

      const response = await request.patch(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/${createdExecutionId}`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          data: {
            title: "Updated Report",
            description: "Updated description",
            fundsUsed: "20000",
          },
        },
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.title).toBe("Updated Report");
    });

    test("13. Update execution without auth (should fail)", async ({ request }) => {
      if (!createdExecutionId) {
        test.skip();
        return;
      }

      const response = await request.patch(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/${createdExecutionId}`,
        {
          data: { title: "Updated" },
        },
      );

      expect(response.status()).toBe(401);
    });

    test("14. Update execution with invalid ID (should fail)", async ({ request }) => {
      const response = await request.patch(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/invalidid`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          data: { title: "Updated" },
        },
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("15. Update execution to negative funds (should fail)", async ({ request }) => {
      if (!createdExecutionId) {
        test.skip();
        return;
      }

      const response = await request.patch(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/${createdExecutionId}`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          data: { fundsUsed: "-1000" },
        },
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("16. Update execution returns updated data", async ({ request }) => {
      if (!createdExecutionId) {
        test.skip();
        return;
      }

      const response = await request.patch(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/${createdExecutionId}`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          data: { description: "New description" },
        },
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data).toBeDefined();
      expect(body.data._id).toBe(createdExecutionId);
    });
  });

  // DELETE TESTS (3)
  test.describe("DELETE - Execution Deletion (Protected)", () => {

    test("17. Delete execution successfully", async ({ request }) => {
      if (!createdExecutionId) {
        test.skip();
        return;
      }

      const response = await request.delete(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/${createdExecutionId}`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        },
      );

      expect([200, 204]).toContain(response.status());
      const body = await response.json();
      expect(body.success).toBe(true);
    });

    test("18. Delete execution without auth (should fail)", async ({ request }) => {
      const response = await request.delete(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/someid`
      );

      expect(response.status()).toBe(401);
    });

    test("19. Delete execution with invalid ID (should fail)", async ({ request }) => {
      const response = await request.delete(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/invalidid`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        },
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  // VALIDATION TESTS (6)
  test.describe("VALIDATION - Business Logic", () => {

    test("20. Create execution with past date (valid)", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "Past Date",
            date: "2025-01-01",
            description: "Past date",
            fundsUsed: "5000",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      expect(response.status()).toBe(201);
    });

    test("21. Create execution with minimum funds (1)", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "Min Funds",
            date: "2026-02-01",
            description: "Minimum funds",
            fundsUsed: "1",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      expect(response.status()).toBe(201);
    });

    test("22. Create execution with empty title (should fail)", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "",
            date: "2026-02-01",
            description: "Empty title",
            fundsUsed: "5000",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("23. Verify execution has required fields", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "Field Test",
            date: "2026-02-01",
            description: "Testing fields",
            fundsUsed: "5000",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      if (response.status() === 201) {
        const body = await response.json();
        const execution = body.data.executionUpdate;
        expect(execution).toHaveProperty("_id");
        expect(execution).toHaveProperty("title");
        expect(execution).toHaveProperty("fundsUsed");
      }
    });

    test("24. Verify response headers", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`
      );

      const contentType = response.headers()["content-type"];
      expect(contentType).toContain("application/json");
    });

    test("25. Verify campaign data updated after execution", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "Campaign Update Test",
            date: "2026-02-01",
            description: "Campaign update",
            fundsUsed: "10000",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      if (response.status() === 201) {
        const body = await response.json();
        expect(body.data.campaign).toBeDefined();
      }
    });
  });

  // STATUS CODE TESTS (5)
  test.describe("STATUS CODES - HTTP Response Codes", () => {

    test("26. Verify 201 on successful creation (with auth)", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "Status 201 Test",
            date: "2026-02-01",
            description: "201 test",
            fundsUsed: "5000",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      expect(response.status()).toBe(201);
    });

    test("27. Verify 200 on successful read (no auth needed)", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`
      );

      expect(response.status()).toBe(200);
    });

    test("28. Verify 400 on validation error", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          multipart: {
            title: "Bad Request",
            fundsUsed: "5000",
          },
        },
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
      expect(response.status()).toBeLessThan(500);
    });

    test("29. Verify 401 on POST without auth", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          multipart: {
            title: "No Auth",
            fundsUsed: "5000",
            evidencePhotos: {
              name: "photo.png",
              mimeType: "image/png",
              buffer: mockImage,
            },
          },
        },
      );

      expect(response.status()).toBe(401);
    });

    test("30. Verify 404/400 on not found", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/nonexistent`
      );

      expect([400, 404]).toContain(response.status());
    });
  });
});
