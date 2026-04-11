import { test, expect } from "@playwright/test";

const API_URL = "http://localhost:5000/api";

async function registerAndLoginUser(request) {
  const uniqueEmail = `campaign.user.${Date.now()}@example.com`;
  const password = "Password123!";

  const registerResponse = await request.post(`${API_URL}/auth/register/user`, {
    data: {
      fullName: "Campaign User",
      email: uniqueEmail,
      password,
    },
  });

  expect(registerResponse.status(), "Registration should succeed").toBe(201);

  const loginResponse = await request.post(`${API_URL}/auth/login`, {
    data: {
      email: uniqueEmail,
      password,
    },
  });

  expect(loginResponse.status(), "Login should succeed").toBe(200);
  const loginBody = await loginResponse.json();
  return loginBody.data.accessToken;
}

async function getFirstCampaignId(request) {
  const response = await request.get(`${API_URL}/campaigns/get-all-campaigns`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.success).toBe(true);
  return body.data?.[0]?._id;
}

test.describe("Campaign API Integration", () => {
  test("GET /campaigns/get-all-campaigns should return success", async ({ request }) => {
    const response = await request.get(`${API_URL}/campaigns/get-all-campaigns`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body).toHaveProperty("data");
  });

  test("GET /campaigns/get-all-campaigns/:campaignId with valid ID should return a campaign", async ({ request }) => {
    const campaignId = await getFirstCampaignId(request);
    expect(campaignId).toBeTruthy();

    const response = await request.get(`${API_URL}/campaigns/get-all-campaigns/${campaignId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty("_id", campaignId);
  });

  test("GET /campaigns/get-all-campaigns with auth token should still return success", async ({ request }) => {
    const token = await registerAndLoginUser(request);

    const response = await request.get(`${API_URL}/campaigns/get-all-campaigns`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body).toHaveProperty("data");
  });

  test("GET /campaigns/get-all-campaigns with status filter should return campaigns", async ({ request }) => {
    const response = await request.get(`${API_URL}/campaigns/get-all-campaigns?status=ONGOING`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    body.data.forEach((campaign) => {
      expect(["ONGOING", "COMPLETED"]).toContain(campaign.status);
    });
  });

  test("GET /campaigns/get-all-campaigns with limit should return at most the requested number", async ({ request }) => {
    const response = await request.get(`${API_URL}/campaigns/get-all-campaigns?limit=1`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeLessThanOrEqual(1);
  });

  test("GET /campaigns/get-all-campaigns?status=COMPLETED should return valid campaign list", async ({ request }) => {
    const response = await request.get(`${API_URL}/campaigns/get-all-campaigns?status=COMPLETED`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("GET /campaigns/get-all-campaigns with auth token and limit should return valid results", async ({ request }) => {
    const token = await registerAndLoginUser(request);

    const response = await request.get(`${API_URL}/campaigns/get-all-campaigns?limit=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeLessThanOrEqual(1);
  });

  test("GET /campaigns/get-all-campaigns/:campaignId with malformed ID should return bad request", async ({ request }) => {
    const malformedId = "123-invalid-id";
    const response = await request.get(`${API_URL}/campaigns/get-all-campaigns/${malformedId}`);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/Invalid .*id/i);
  });

  test("POST /campaigns/add-campaign without auth should return unauthorized", async ({ request }) => {
    const response = await request.post(`${API_URL}/campaigns/add-campaign`, {
      data: {
        title: "Async campaign test",
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/not authorized|unauthorized|token/i);
  });
});

test.describe("Campaign API Performance", () => {
  test("should handle 10 concurrent public campaign requests with acceptable latency", async ({ request }) => {
    const requestCount = 10;
    const start = Date.now();

    const responses = await Promise.all(
      Array.from({ length: requestCount }, () =>
        request.get(`${API_URL}/campaigns/get-all-campaigns`),
      ),
    );

    const elapsed = Date.now() - start;
    const average = elapsed / requestCount;

    for (const response of responses) {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    }

    expect(average).toBeLessThan(500);
  });
});
