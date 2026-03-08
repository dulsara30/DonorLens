import { test, expect } from "@playwright/test";

const API_URL = "http://localhost:5000/api";

test.describe("Authentication APIs", () => {
  test("POST /auth/register - should register new user", async ({
    request,
  }) => {
    const response = await request.post(`${API_URL}/auth/register/user`, {
      data: {
        fullName: "Test User",
        email: `testuser${Date.now()}@example.com`,
        password: "password123",
        role: "USER",
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toHaveProperty("user");
  });
});
