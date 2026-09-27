import test, { describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getMyCampaignsController } from "../src/controllers/campaigns/getMyCampaigns.controller.js";
import * as getMyCampaignsUsecaseModule from "../src/usecases/campaigns/getMyCampaigns.usecase.js";

describe("F1 - Campaign Status Filter & Limit Validation", () => {
  let req, res, next, nextError;

  beforeEach(() => {
    nextError = null;
    req = {
      user: { userId: "507f1f77bcf86cd799439011" },
      query: {},
    };
    res = {
      statusCode: 200,
      jsonResponse: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.jsonResponse = data;
        return this;
      },
    };
    next = (err) => {
      nextError = err;
    };
  });

  test("rejects array status query parameter with 400 Bad Request", async () => {
    req.query.status = ["ONGOING", "COMPLETED"];

    await getMyCampaignsController(req, res, next);

    assert.ok(nextError, "Expected an error passed to next()");
    assert.equal(nextError.statusCode, 400);
    assert.match(nextError.message, /Invalid status query parameter/i);
  });

  test("rejects invalid status string with 400 Bad Request", async () => {
    req.query.status = "INVALID_STATUS";

    await getMyCampaignsController(req, res, next);

    assert.ok(nextError, "Expected an error passed to next()");
    assert.equal(nextError.statusCode, 400);
    assert.match(nextError.message, /Invalid status query parameter/i);
  });

  test("rejects object status parameter ($ne NoSQL injection attempts) with 400", async () => {
    req.query.status = { $ne: "CANCELLED" };

    await getMyCampaignsController(req, res, next);

    assert.ok(nextError, "Expected an error passed to next()");
    assert.equal(nextError.statusCode, 400);
  });

  test("rejects limit less than 1 with 400 Bad Request", async () => {
    req.query.limit = "0";

    await getMyCampaignsController(req, res, next);

    assert.ok(nextError, "Expected an error passed to next()");
    assert.equal(nextError.statusCode, 400);
    assert.match(nextError.message, /Invalid limit query parameter/i);
  });

  test("rejects limit greater than 100 with 400 Bad Request", async () => {
    req.query.limit = "150";

    await getMyCampaignsController(req, res, next);

    assert.ok(nextError, "Expected an error passed to next()");
    assert.equal(nextError.statusCode, 400);
    assert.match(nextError.message, /Invalid limit query parameter/i);
  });

  test("accepts valid status and limit without throwing input validation errors", async () => {
    req.query.status = "ONGOING";
    req.query.limit = "20";

    await getMyCampaignsController(req, res, next);

    if (nextError) {
      assert.notEqual(nextError.name, "InvalidInputError", "Valid inputs must not trigger InvalidInputError");
      assert.notEqual(nextError.statusCode, 400, "Valid inputs must not trigger 400 Bad Request");
    }
  });
});
