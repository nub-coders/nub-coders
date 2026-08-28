import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import AboutSection from "@/sections/AboutSection";
import ContactSection from "@/sections/ContactSection";
import NowSection from "@/sections/NowSection";
import ProjectsSection from "@/sections/ProjectsSection";
import TechStackSection from "@/sections/TechStackSection";

// A bare <section> is a generic container: it only becomes a `region` landmark,
// and only shows up in a screen reader's landmark list, once it has an
// accessible name. Each of these is named by its own visible <h2>, so the
// landmark list can never drift from what's on screen.
const cases = [
  { name: "About", anchor: "about", render: () => <AboutSection /> },
  { name: "Stack", anchor: "tech", render: () => <TechStackSection /> },
  { name: "Selected Work", anchor: "work", render: () => <ProjectsSection /> },
  { name: "Now", anchor: "now", render: () => <NowSection /> },
  { name: "Contact", anchor: "contact", render: () => <ContactSection /> },
];

describe("section landmarks", () => {
  test.each(cases)("$name is a region named by its heading", ({ name, render: renderSection }) => {
    render(renderSection());

    const region = screen.getByRole("region", { name });
    // The name comes from the heading element itself, not a duplicated string.
    expect(region).toHaveAttribute("aria-labelledby", screen.getByRole("heading", { name, level: 2 }).id);
  });

  test.each(cases)("$name keeps the id the nav scrolls to", ({ name, anchor, render: renderSection }) => {
    render(renderSection());

    // Nav.tsx builds hrefs as `#${id}` and the scroll-spy observes the same ids,
    // so renaming one silently breaks both.
    expect(screen.getByRole("region", { name })).toHaveAttribute("id", anchor);
  });
});
