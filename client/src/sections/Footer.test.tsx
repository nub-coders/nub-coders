import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Footer from "@/sections/Footer";
import { contactLinks } from "@/data/contactLinks";

describe("Footer", () => {
  test("renders dynamic copyright year range", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© 2023–${currentYear}`)),
    ).toBeInTheDocument();
  });

  test("renders every contact link with a safe target", () => {
    render(<Footer />);
    for (const link of contactLinks) {
      const anchor = screen.getByRole("link", { name: link.label });
      expect(anchor).toHaveAttribute("href", link.href);
      if (!link.href.startsWith("mailto:")) {
        expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
        expect(anchor).toHaveAttribute("target", "_blank");
      }
    }
  });
});
