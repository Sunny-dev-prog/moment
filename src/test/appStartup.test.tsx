import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

describe("App startup", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(window.HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the homepage selector on the root route", async () => {
    render(<App />);

    expect(await screen.findByTestId("homepage-theme-grid")).toBeInTheDocument();
    expect(screen.getByTestId("theme-button-001")).toBeInTheDocument();
    expect(screen.getByTestId("theme-button-006")).toBeInTheDocument();
  });
});
