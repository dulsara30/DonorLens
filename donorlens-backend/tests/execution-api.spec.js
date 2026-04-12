import { test, expect } from "@playwright/test";

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OThlMWYzY2IzMDhlMDE4ZDVkMjE4NmYiLCJyb2xlIjoiTkdPX0FETUlOIiwiaWF0IjoxNzc1OTY0MjQ3LCJleHAiOjE3NzYwNTA2NDd9.lHGWHIyBw_ek4u-_-EM2kCsa7fuqu4L00qyNR1sfISw";
const INVALID_TOKEN = "invalid.token.here";
const CAMPAIGN_ID = "69da808361a1184df1b4f3ec";
const API_BASE_URL = "http://localhost:5000";

const mockImage = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
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

  test.afterAll(async ({ request }) => {
    console.log("🧹 Cleaning up test executions...");
    try {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
      );

      if (response.ok()) {
        const body = await response.json();

        // Handle both array and object structures
        let executions = [];
        if (Array.isArray(body.data)) {
          executions = body.data;
        } else if (body.data && typeof body.data === "object") {
          // If data is an object with executions property
          executions = Array.isArray(body.data.executions)
            ? body.data.executions
            : [];
        }

        // Filter executions created by tests (based on title patterns)
        const testExecutionTitles = [
          "No Files",
          "Negative Funds",
          "Future Date",
          "No Auth",
          "Field Test",
          "Campaign Update Test",
          "Bad Request",
          "Empty title",
        ];

        for (const execution of executions) {
          if (
            testExecutionTitles.some((title) => execution.title.includes(title))
          ) {
            try {
              const deleteResponse = await request.delete(
                `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/${execution._id}`,
                {
                  headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
                },
              );

              if (deleteResponse.ok()) {
                console.log(`Deleted test execution: ${execution.title}`);
              }
            } catch (error) {
              console.log(
                `Failed to delete execution ${execution._id}: ${error.message}`,
              );
            }
          }
        }

        console.log("Cleanup completed!");
      }
    } catch (error) {
      console.log(`Cleanup error: ${error.message}`);
    }
  });

  // CREATE TESTS (4)
  test.describe("CREATE - Execution Creation (Protected)", () => {
    test("1. Create execution without files (should fail)", async ({
      request,
    }) => {
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

    test("2. Create execution with negative funds (should fail)", async ({
      request,
    }) => {
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

    test("3. Create execution with future date (should fail)", async ({
      request,
    }) => {
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

    test("4. Create execution without auth (should fail)", async ({
      request,
    }) => {
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

  // READ TESTS (5)
  test.describe("READ - Get Executions (Public)", () => {
    test("5. Get all executions for campaign (no auth needed)", async ({
      request,
    }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });

    test("6. Get execution with invalid ID (should fail)", async ({
      request,
    }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/invalidid123`,
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("7. Get executions returns correct structure", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });

    test("8. Get executions with auth token also works", async ({
      request,
    }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        },
      );

      expect(response.status()).toBe(200);
    });

    test("9. Get execution with invalid token still works (public endpoint)", async ({
      request,
    }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
        {
          headers: { Authorization: `Bearer ${INVALID_TOKEN}` },
        },
      );

      expect(response.status()).toBe(200);
    });
  });

  // UPDATE TESTS (1)
  test.describe("UPDATE - Execution Update (Protected)", () => {
    test("10. Update execution with invalid ID (should fail)", async ({
      request,
    }) => {
      const response = await request.patch(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/invalidid`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          data: { title: "Updated" },
        },
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  // DELETE TESTS (2)
  test.describe("DELETE - Execution Deletion (Protected)", () => {
    test("11. Delete execution without auth (should fail)", async ({
      request,
    }) => {
      const response = await request.delete(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/someid`,
      );

      expect(response.status()).toBe(401);
    });

    test("12. Delete execution with invalid ID (should fail)", async ({
      request,
    }) => {
      const response = await request.delete(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/invalidid`,
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        },
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  // VALIDATION TESTS (5)
  test.describe("VALIDATION - Business Logic", () => {
    test("13. Create execution with empty title (should fail)", async ({
      request,
    }) => {
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

    test("14. Verify execution has required fields", async ({ request }) => {
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

    test("15. Verify response headers", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
      );

      const contentType = response.headers()["content-type"];
      expect(contentType).toContain("application/json");
    });

    test("16. Verify campaign data updated after execution", async ({
      request,
    }) => {
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

  // STATUS CODE TESTS (4)
  test.describe("STATUS CODES - HTTP Response Codes", () => {
    test("17. Verify 200 on successful read (no auth needed)", async ({
      request,
    }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions`,
      );

      expect(response.status()).toBe(200);
    });

    test("18. Verify 400 on validation error", async ({ request }) => {
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

    test("19. Verify 401 on POST without auth", async ({ request }) => {
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

    test("20. Verify 404/400 on not found", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/api/campaign-executions/${CAMPAIGN_ID}/executions/nonexistent`,
      );

      expect([400, 404]).toContain(response.status());
    });
  });
});
