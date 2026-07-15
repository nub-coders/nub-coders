import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import ContactSection from "@/sections/ContactSection";

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

async function fillRequiredFields() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name"), "Jane Recruiter");
  await user.type(screen.getByLabelText("Email"), "jane@example.com");
  await user.type(screen.getByLabelText("Message"), "Let's talk about a role.");
  return user;
}

describe("ContactSection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("shows a validation error without hitting the API when fields are empty", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      screen.getByText(/fill in your name, email, and a message/i),
    ).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("rejects an invalid email before submitting", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<ContactSection />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Name"), "Jane");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Message"), "Hello");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      screen.getByText(/valid email address/i),
    ).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("shows success feedback and clears the form on a 200 response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ success: true }),
    );
    render(<ContactSection />);
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/message sent/i);
    });
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
  });

  test("shows the server error and a direct-email fallback on failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(
        { success: false, error: "Too many messages. Please try again later." },
        false,
        429,
      ),
    );
    render(<ContactSection />);
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: /send message/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/too many messages/i);
    expect(
      screen.getByRole("link", { name: "dev@nubcoders.com" }),
    ).toHaveAttribute("href", "mailto:dev@nubcoders.com");
  });
});
