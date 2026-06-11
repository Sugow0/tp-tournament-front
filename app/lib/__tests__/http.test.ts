import { beforeEach, describe, expect, it, vi } from "vitest";
import * as auth from "~/lib/auth";
import { ApiError, apiFetch } from "~/lib/http";

vi.mock("~/lib/auth", () => ({ getAccessToken: vi.fn() }));
const mockGetAccessToken = vi.mocked(auth.getAccessToken);

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  };
}

describe("apiFetch", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockGetAccessToken.mockReset();
    mockGetAccessToken.mockReturnValue(null);
  });

  it("returns parsed JSON on 2xx", async () => {
    mockFetch.mockResolvedValue(makeResponse(200, { id: 1 }));
    const result = await apiFetch<{ id: number }>("/test");
    expect(result).toEqual({ id: 1 });
  });

  it("sends Content-Type: application/json by default", async () => {
    mockFetch.mockResolvedValue(makeResponse(200, {}));
    await apiFetch("/test");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      })
    );
  });

  it("throws ApiError on non-2xx response", async () => {
    mockFetch.mockResolvedValue(makeResponse(404, { message: "not found" }));
    await expect(apiFetch("/test")).rejects.toBeInstanceOf(ApiError);
  });

  it("exposes status and body on ApiError", async () => {
    mockFetch.mockResolvedValue(makeResponse(422, { error: "invalid" }));
    const err = await apiFetch("/test").catch((e) => e);
    expect(err.status).toBe(422);
    expect(err.body).toEqual({ error: "invalid" });
  });

  it("falls back to empty object if error body is not JSON", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("not json")),
    });
    const err = await apiFetch("/test").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.body).toEqual({});
  });

  it("adds Authorization header when an access token exists", async () => {
    mockGetAccessToken.mockReturnValue("access-123");
    mockFetch.mockResolvedValue(makeResponse(200, {}));
    await apiFetch("/test");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer access-123" }),
      })
    );
  });

  it("omits the Authorization header when no token exists", async () => {
    mockGetAccessToken.mockReturnValue(null);
    mockFetch.mockResolvedValue(makeResponse(200, {}));
    await apiFetch("/test");
    const headers = mockFetch.mock.calls[0][1].headers as Record<string, string>;
    expect(headers).not.toHaveProperty("Authorization");
  });
});
