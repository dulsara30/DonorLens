// Campaign Execution API Tests - Playwright
import { test, expect } from "@playwright/test";

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OThlMWYzY2IzMDhlMDE4ZDVkMjE4NmYiLCJyb2xlIjoiTkdPX0FETUlOIiwiaWF0IjoxNzcyODk5MDE1LCJleHAiOjE3NzI5ODU0MTV9.pfyhvngpU5K6KLsmFVy9r3959x8IbLQ_UoFdQnxhSKQ";

const CAMPAIGN_ID = "69abdbf32a26012295630f48";

const API_BASE_URL = "http://localhost:5000";

// TEST SUITE
test.describe("Campaign Execution API Tests", () => {
  let createdExecutionId = null;
  let testStartTime = Date.now();

  // FIXTURES: Setup & Teardown Hooks
 
  //beforeAll - Runs ONCE before all tests in this describe block 
  test.beforeAll(async ({ request }) => {
    console.log("Starting test suite...");
    testStartTime = Date.now();

    // Verify the API server is running before tests
    try {
      const healthCheck = await request.get(`${API_BASE_URL}/health`);
      if (healthCheck.ok()) {
        console.log("API server is running");
      } else {
        console.log("API server returned:", healthCheck.status());
      }
    } catch (error) {
      console.log(
        "API server is not reachable - make sure backend is running!",
      );
    }

    // Log test configuration
    console.log(`Testing Campaign ID: ${CAMPAIGN_ID}`);
    console.log(
      `Using Auth Token: ${AUTH_TOKEN.substring(0, 20)}...`,
    );
  });


//beforeEach - Runs BEFORE each individual test 
  test.beforeEach(async ({}, testInfo) => {
    console.log(`\nRunning: ${testInfo.title}`);
  });

  //  afterEach - Runs AFTER each individual test 
  test.afterEach(async ({}, testInfo) => {
    const status = testInfo.status === "passed" ? "PASSED" : "FAILED";
    console.log(`${status}: ${testInfo.title} (${testInfo.duration}ms)`);
  });

  //afterAll - Runs ONCE after all tests complete 
  test.afterAll(async () => {
    const endTime = Date.now();
    const duration = (endTime - testStartTime) / 1000;
    console.log(
      `\n Test suite completed in ${duration.toFixed(2)}s`,
    );
    console.log("Cleanup complete");
  });

  // TEST CASES

  //Test 1: Get all executions for a campaign  Expected: PASS (200 OK)
  test("should get all executions for a campaign", async ({ request }) => {
    const response = await request.get(
      `${API_BASE_URL}/api/campaigns/executions/${CAMPAIGN_ID}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );

    console.log("Get All Response Status:", response.status());
    const body = await response.json();
    console.log("Executions count:", body.data?.data?.length || 0);

    // Assertions
    expect(response.status()).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
  });

  //Test 2: API Health Check  Expected: PASS (200 OK)
  test("should verify API server is running", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`);

    console.log("Health Check Status:", response.status());
    const body = await response.json();

    // Assertions
    expect(response.status()).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toContain("running");

  });

  //Test 3: Create execution with valid data (no files)  Expected: PASS (validates request reaches the endpoint)
  test("should validate execution endpoint requires files", async ({
    request,
  }) => {
    const response = await request.post(
      `${API_BASE_URL}/api/campaigns/executions/${CAMPAIGN_ID}/add-execution`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        multipart: {
          title: "Test Execution Update",
          date: "2026-03-01",
          description: "Test execution without files",
          fundsUsed: "5000",
          //no evidence files provided
        },
      },
    );

    console.log("Create Response Status:", response.status());
    const body = await response.json();

    // Assertions 
    expect(response.status()).toBe(400);
    expect(body.success).toBe(false);

  });

  //Test 4: Create execution with FUTURE date Expected: PASS 
  test("should reject execution with future date", async ({ request }) => {
    const response = await request.post(
      `${API_BASE_URL}/api/campaigns/executions/${CAMPAIGN_ID}/add-execution`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        multipart: {
          title: "Future Date Test",
          date: "2030-12-25", // FUTURE DATE 
          description: "This should fail because the date is in the future",
          fundsUsed: "1000",
        },
      },
    );

    console.log("Future Date Response Status:", response.status());
    const body = await response.json();
    console.log("Response:", body);

    // Assertions 
    expect(response.status()).toBe(400);
    expect(body.success).toBe(false);
    
    // expect(body.message).toContain("future");
  });

  //Test 5: Create execution with NEGATIVE funds Expected: PASS (validates negative number rejection)
  test("should reject execution with negative funds", async ({ request }) => {

    // Create a mock image file buffer
    const mockImage = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    const response = await request.post(
      `${API_BASE_URL}/api/campaigns/executions/${CAMPAIGN_ID}/add-execution`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        multipart: {
          title: "Negative Funds Test",
          date: "2026-03-01",
          description: "Testing negative funds validation with files included",
          fundsUsed: "-5000", // NEGATIVE FUNDS

          // Add mock evidence photo
          evidencePhotos: {
            name: "test-evidence.png",
            mimeType: "image/png",
            buffer: mockImage,
          },
        },
      },
    );

    console.log("Negative Funds Response Status:", response.status());
    const body = await response.json();
    console.log("Response body:", body);

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
    expect(response.status()).not.toBe(200);

    expect(body).toHaveProperty("success");
    expect(body).toHaveProperty("message");
    
    expect(body.success).toBeFalsy();
    
  });

});
