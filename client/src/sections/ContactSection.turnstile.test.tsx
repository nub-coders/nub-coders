import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { forwardRef, useImperativeHandle } from "react";
import ContactSection from "@/sections/ContactSection";

const SITE_KEY = "0xTEST_SITE_KEY";

vi.mock("@/lib/appConfig", () => ({
  appConfig: { turnstileSiteKey: "0xTEST_SITE_KEY" },
}));

const resetSpy = vi.fn();

// Stand-in for the real widget: exposes the same ref contract plus buttons to
// drive the token callback, so the form's gating logic is what gets tested.
vi.mock("@/components/Turnstile", () => ({
  default: forwardRef<
    { reset: () => void },
    { siteKey: string; onToken: (token: string | null) => void; onError?: () => void }
  >(function TurnstileStub({ siteKey, onToken, onError }, ref) {
    useImperativeHandle(ref, () => ({ reset: resetSpy }), []);
    return (
      <div data-testid="turnstile" data-sitekey={siteKey}>
        <button type="button" onClick={() => onToken("test-token")}>
          simulate verify
        </button>
        <button type="button" onClick={() => onError?.()}>
          simulate error
        </button>
      </div>
    );
  }),
}));

function jsonResponse(body: unknown, ok = true, status = 200) {
  return { ok, status, json: () => Promise.resolve(body) } as Response;
}

async function fillRequiredFields() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name"), "Jane Recruiter");
  await user.type(screen.getByLabelText("Email"), "jane@example.com");
  await user.type(screen.getByLabelText("Message"), "Let's talk about a role.");
  return user;
}

describe("ContactSection with Turnstile enabled", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    resetSpy.mockClear();
  });

  test("renders the widget with the configured site key", () => {
    render(<ContactSection />);
    expect(screen.getByTestId("turnstile")).toHaveAttribute("data-sitekey", SITE_KEY);
  });

  test("blocks submission until the challenge is solved", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<ContactSection />);
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/complete the verification/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("posts the token and re-arms the widget after a successful send", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ success: true }));
    render(<ContactSection />);
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: /simulate verify/i }));
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/message sent/i);
    });

    const body = JSON.parse(String(fetchSpy.mock.calls[0][1]?.body));
    expect(body.turnstileToken).toBe("test-token");
    expect(resetSpy).toHaveBeenCalled();
  });

  test("re-arms the widget after a failed send so the user can retry", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ success: false, error: "Verification failed. Please retry the challenge." }, false, 403),
    );
    render(<ContactSection />);
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: /simulate verify/i }));
    await user.click(screen.getByRole("button", { name: /send message/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/verification failed/i);
    expect(resetSpy).toHaveBeenCalled();
  });

  test("surfaces a load failure reported by the widget", async () => {
    render(<ContactSection />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /simulate error/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/verification failed to load/i);
  });
});
