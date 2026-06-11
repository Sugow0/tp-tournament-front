import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "~/lib/http";
import * as authService from "~/services/auth.service";
import type { AuthResponse } from "~/types/auth";

vi.mock("~/services/auth.service");
const mockLogin = vi.mocked(authService.login);

const fakeAuth: AuthResponse = {
  accessToken: "access-123",
  refreshToken: "refresh-456",
  expiresAt: "2026-12-31T00:00:00Z",
  tokenType: "Bearer",
};

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/login", { method: "POST", body: form });
}

describe("login action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls login with the submitted credentials", async () => {
    mockLogin.mockResolvedValue(fakeAuth);
    const { action } = await import("~/routes/login");
    const request = makePostRequest({ email: "arthur@avalon.test", password: "excalibur" });
    await action({ request, params: {}, context: {} });
    expect(mockLogin).toHaveBeenCalledWith({
      email: "arthur@avalon.test",
      password: "excalibur",
    });
  });

  it("returns the AuthResponse on success", async () => {
    mockLogin.mockResolvedValue(fakeAuth);
    const { action } = await import("~/routes/login");
    const request = makePostRequest({ email: "arthur@avalon.test", password: "excalibur" });
    const res = await action({ request, params: {}, context: {} });
    expect(res).toEqual(fakeAuth);
  });

  it("returns an error object when ApiError is thrown", async () => {
    mockLogin.mockRejectedValue(new ApiError(401, { message: "unauthorized" }));
    const { action } = await import("~/routes/login");
    const request = makePostRequest({ email: "x@y.z", password: "bad" });
    const res = await action({ request, params: {}, context: {} });
    expect(res).toHaveProperty("error");
  });
});
