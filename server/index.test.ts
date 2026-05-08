import { expect, test, describe, mock, beforeEach } from "bun:test";
import { Request, Response, NextFunction } from "express";

// Mock dependencies before importing logMiddleware
mock.module("./vite", () => ({
  log: mock((_msg: string) => {}),
  setupVite: mock(() => {}),
  serveStatic: mock(() => {}),
}));

mock.module("./routes", () => ({
  registerRoutes: mock(() => Promise.resolve({
    listen: mock((_opts: any, cb: () => void) => {
      if (cb) cb();
    })
  })),
}));

// Now import logMiddleware
import { logMiddleware } from "./index";
import { log } from "./vite";

describe("logMiddleware", () => {
  beforeEach(() => {
    (log as any).mockClear();
  });

  test("should log response body for /api routes (vulnerability demonstration)", () => {
    const req = {
      path: "/api/test",
      method: "POST",
    } as unknown as Request;

    let finishCallback: () => void = () => {};
    const res = {
      statusCode: 200,
      json: function (body: any) {
        this.capturedBody = body;
        return this;
      },
      on: mock((event: string, callback: () => void) => {
        if (event === "finish") finishCallback = callback;
      }),
      capturedBody: undefined as any,
    } as unknown as Response & { capturedBody: any };

    const next = mock(() => {}) as unknown as NextFunction;

    logMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();

    const sensitiveData = { password: "secret_password", creditCard: "1234-5678-9012-3456" };
    res.json(sensitiveData);

    finishCallback();

    const logMock = log as any;
    expect(logMock).toHaveBeenCalled();

    const lastCall = logMock.mock.calls[logMock.mock.calls.length - 1][0];
    const expectedPart = JSON.stringify(sensitiveData).slice(0, 40);
    expect(lastCall).not.toContain(expectedPart);
  });

  test("should not log for non-api routes", () => {
    const req = {
      path: "/some-other-route",
      method: "GET",
    } as unknown as Request;

    let finishCallback: () => void = () => {};
    const res = {
      statusCode: 200,
      json: function (body: any) {
        this.capturedBody = body;
        return this;
      },
      on: mock((event: string, callback: () => void) => {
        if (event === "finish") finishCallback = callback;
      }),
    } as unknown as Response;

    const next = mock(() => {}) as unknown as NextFunction;

    logMiddleware(req, res, next);
    res.json({ foo: "bar" });
    finishCallback();

    const logMock = log as any;
    expect(logMock).not.toHaveBeenCalled();
  });
});
