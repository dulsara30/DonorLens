import { test, expect } from "@playwright/test";

const API_URL = "http://localhost:5000/api";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Register a fresh donor and return their auth token. */
async function registerAndLoginDonor(request) {
  const email = `donor${Date.now()}@example.com`;
  const registerRes = await request.post(`${API_URL}/auth/register/user`, {
    data: {
      fullName: "Test Donor",
      email,
      password: "password123",
      role: "USER",
    },
  });
  expect(registerRes.status()).toBe(201);

  const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: { email, password: "password123" },
  });
  expect(loginRes.status()).toBe(200);
  const loginBody = await loginRes.json();
  return loginBody.data?.accessToken;
}

/** Login as the seeded system admin and return the access token. */
async function loginAsAdmin(request) {
  const res = await request.post(`${API_URL}/auth/login`, {
    data: { email: "admin.donorlens@gmail.com", password: "admin123" },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  return body.data?.accessToken;
}

test.describe("Payment API Tests", () => {
  let donorToken;
  let adminToken;

  let validCampaignId;

  test.beforeAll(async ({ request }) => {
    donorToken = await registerAndLoginDonor(request);
    adminToken = await loginAsAdmin(request);

    // Fetch the first available ONGOING campaign to use in tests
    const campaignsRes = await request.get(`${API_URL}/campaigns`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (campaignsRes.ok()) {
      const body = await campaignsRes.json();
      const campaigns = body.data ?? body;
      const ongoing = Array.isArray(campaigns)
        ? campaigns.find((c) => c.status === "ONGOING")
        : null;
      validCampaignId = ongoing?._id ?? null;
    }

    console.log("Payment tests ready. campaign:", validCampaignId);
  });

  test("paument_health_check - payment route should be healthy", async ({
    request,
  }) => {
    const res = await request.get(`${API_URL}/payment/health`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain("healthy");

    console.log("Health check passed");
  });

  test("paument_create_success_with_valid_data - should create payment with all valid fields", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: 500,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain("success");
    expect(body.data).toHaveProperty("_id");
    expect(body.data.amount).toBe(500);
    expect(body.data.status).toBe("COMPLETED");

    console.log("Payment created:", body.data._id);
  });

  test("paument_create_success_default_currency - should default to LKR when currency is omitted", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: 1000,
        paymentMethod: "ONLINE",
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.currency).toBe("LKR");
  });

  test("paument_create_success_bank_transfer - should create payment using BANK_TRANSFER method", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: 2500,
        currency: "LKR",
        paymentMethod: "BANK_TRANSFER",
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.paymentMethod).toBe("BANK_TRANSFER");
  });

  test("paument_create_success_minimum_amount - should accept amount equal to minimum allowed (1)", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: 1,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.amount).toBe(1);
  });

  test("paument_create_success_updates_campaign_raised_amount - should increment campaign raisedAmount after payment", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    // Fetch campaign before
    const beforeRes = await request.get(
      `${API_URL}/campaigns/${validCampaignId}`,
    );
    const beforeBody = await beforeRes.json();
    const raisedBefore =
      beforeBody.data?.raisedAmount ?? beforeBody.raisedAmount ?? 0;

    const donationAmount = 300;
    await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: donationAmount,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    // Fetch campaign after
    const afterRes = await request.get(
      `${API_URL}/campaigns/${validCampaignId}`,
    );
    const afterBody = await afterRes.json();
    const raisedAfter =
      afterBody.data?.raisedAmount ?? afterBody.raisedAmount ?? 0;

    expect(raisedAfter).toBe(raisedBefore + donationAmount);
    console.log(
      `raisedAmount updated: ${raisedBefore} → ${raisedAfter}`,
    );
  });

  test("paument_create_fail_missing_campaign_id - should return 400 when campaignId is missing", async ({
    request,
  }) => {
    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        amount: 500,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/campaignId/i);
  });

  test("paument_create_fail_missing_amount - should return 400 when amount is missing", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/campaignId and amount/i);
  });

  test("paument_create_fail_missing_payment_method - should return 400 when paymentMethod is missing", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: 500,
        currency: "LKR",
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/paymentMethod/i);
  });

  test("paument_create_fail_zero_amount - should return 400 when amount is zero", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: 0,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/positive number/i);
  });

  test("paument_create_fail_negative_amount - should return 400 when amount is negative", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: -100,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/positive number/i);
  });

  test("paument_create_fail_string_amount - should return 400 when amount is a string", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: "five-hundred",
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test("paument_create_fail_invalid_campaign_id - should return error for non-existent campaignId", async ({
    request,
  }) => {
    const nonExistentId = "000000000000000000000000"; // valid ObjectId format, won't exist

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: nonExistentId,
        amount: 500,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    // Expect either 404 or 500 – campaign not found
    expect([400, 404, 500]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test("paument_create_fail_unauthenticated - should return 401 when no token is provided", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      data: {
        campaignId: validCampaignId,
        amount: 500,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    expect(res.status()).toBe(401);
    console.log("Unauthenticated request correctly rejected");
  });

  test("paument_create_fail_empty_body - should return 400 when request body is empty", async ({
    request,
  }) => {
    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {},
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test("paument_edge_very_large_amount - should accept a very large valid amount", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: 9999999,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    // The API should either accept it (201) or enforce a business-level limit
    expect([201, 400]).toContain(res.status());
    if (res.status() === 201) {
      const body = await res.json();
      expect(body.data.amount).toBe(9999999);
    }
  });

  test("paument_edge_float_amount - should handle float amounts correctly", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: 99.99,
        currency: "LKR",
        paymentMethod: "CARD",
      },
    });

    // Floating-point amounts should be accepted (99.99 > 0)
    expect([201, 400]).toContain(res.status());
    if (res.status() === 201) {
      const body = await res.json();
      expect(body.data.amount).toBeCloseTo(99.99, 2);
    }
  });

  test("paument_edge_null_currency_defaults_to_lkr - should fall back to LKR when currency is null", async ({
    request,
  }) => {
    test.skip(!validCampaignId, "No ONGOING campaign found in DB");

    const res = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        campaignId: validCampaignId,
        amount: 500,
        currency: null,
        paymentMethod: "CARD",
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.data.currency).toBe("LKR");
  });

  test("paument_get_my_history_success - should return authenticated donor payment history", async ({
    request,
  }) => {
    const res = await request.get(`${API_URL}/payment/my`, {
      headers: { Authorization: `Bearer ${donorToken}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body).toHaveProperty("count");
    expect(Array.isArray(body.data)).toBe(true);

    console.log(`Donor has ${body.count} payment(s)`);
  });

  test("paument_get_my_history_unauthenticated - should return 401 without auth token", async ({
    request,
  }) => {
    const res = await request.get(`${API_URL}/payment/my`);
    expect(res.status()).toBe(401);
    console.log("Unauthenticated history request correctly rejected");
  });

  test("paument_get_my_history_empty_for_new_user - should return empty list for a brand-new donor", async ({
    request,
  }) => {
    // Create a fresh donor who has never donated
    const freshToken = await registerAndLoginDonor(request);

    const res = await request.get(`${API_URL}/payment/my`, {
      headers: { Authorization: `Bearer ${freshToken}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.count).toBe(0);
    expect(body.data).toHaveLength(0);
  });

  test("paument_admin_get_all_payments_success - admin should fetch all payment records", async ({
    request,
  }) => {
    const res = await request.get(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body).toHaveProperty("count");

    console.log(`Total payments in DB: ${body.count}`);
  });

  test("paument_admin_get_all_payments_forbidden_for_donor - non-admin should be rejected with 403", async ({
    request,
  }) => {
    const res = await request.get(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
    });

    expect(res.status()).toBe(403);
  });

  test("paument_admin_get_all_payments_unauthenticated - should return 401 without token", async ({
    request,
  }) => {
    const res = await request.get(`${API_URL}/payment`);
    expect(res.status()).toBe(401);
  });

  test("paument_logs_get_all_success - should return all payment logs", async ({
    request,
  }) => {
    const res = await request.get(`${API_URL}/payment/logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    // Logs endpoint has no auth guard by default — adjust if auth is added later
    expect([200, 401, 403]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
      console.log(`Total logs: ${body.length}`);
    }
  });

  test("paument_logs_created_on_failed_payment - a FAILED log should be created when validation fails", async ({
    request,
  }) => {
    // Make a request that will trigger a VALIDATION_ERROR log (missing campaignId)
    const paymentRes = await request.post(`${API_URL}/payment`, {
      headers: { Authorization: `Bearer ${donorToken}` },
      data: {
        amount: 500,
        currency: "LKR",
        paymentMethod: "CARD",
        // campaignId intentionally omitted
      },
    });
    expect(paymentRes.status()).toBe(400);

    // Fetch logs and confirm a FAILED entry was recorded
    const logsRes = await request.get(`${API_URL}/payment/logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (logsRes.status() === 200) {
      const logs = await logsRes.json();
      const failedLogs = logs.filter((l) => l.status === "FAILED");
      expect(failedLogs.length).toBeGreaterThan(0);
      console.log(`FAILED log entries found: ${failedLogs.length}`);
    }
  });
});
