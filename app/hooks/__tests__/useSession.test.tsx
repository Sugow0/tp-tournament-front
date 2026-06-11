import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSession } from "~/hooks/useSession";

const mocks = vi.hoisted(() => ({
  isAuthenticated: vi.fn(),
}));

vi.mock("~/lib/auth", () => ({
  isAuthenticated: mocks.isAuthenticated,
}));

describe("useSession", () => {
  beforeEach(() => {
    mocks.isAuthenticated.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("becomes ready after mount", () => {
    mocks.isAuthenticated.mockReturnValue(false);
    const { result } = renderHook(() => useSession());
    expect(result.current.ready).toBe(true);
  });

  it("reflects isAuthenticated() after mount", () => {
    mocks.isAuthenticated.mockReturnValue(true);
    const { result } = renderHook(() => useSession());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("updates when a tournament:auth-change event fires", () => {
    // logged out on mount, then logged in.
    mocks.isAuthenticated.mockReturnValueOnce(false).mockReturnValue(true);
    const { result } = renderHook(() => useSession());
    expect(result.current.isAuthenticated).toBe(false);

    act(() => {
      window.dispatchEvent(new Event("tournament:auth-change"));
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it("updates when a native storage event fires", () => {
    mocks.isAuthenticated.mockReturnValueOnce(true).mockReturnValue(false);
    const { result } = renderHook(() => useSession());
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("storage"));
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("removes its listeners on unmount", () => {
    mocks.isAuthenticated.mockReturnValue(false);
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useSession());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("tournament:auth-change", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("storage", expect.any(Function));
  });
});
