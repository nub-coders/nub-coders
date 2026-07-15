import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ProjectsSection from "@/sections/ProjectsSection";
import { projects } from "@/data/projects";

describe("ProjectsSection", () => {
  test("renders a card for every project with its live link", () => {
    render(<ProjectsSection />);
    for (const project of projects) {
      expect(
        screen.getByRole("heading", { name: project.name }),
      ).toBeInTheDocument();
      const liveLink = screen.getByRole("link", {
        name: `Open ${project.name} live app`,
      });
      expect(liveLink).toHaveAttribute("href", project.liveUrl);
    }
  });

  test("renders a source-code link only for projects that have one", () => {
    render(<ProjectsSection />);
    for (const project of projects) {
      const codeLink = screen.queryByRole("link", {
        name: `Open ${project.name} source code`,
      });
      if (project.codeUrl) {
        expect(codeLink).toHaveAttribute("href", project.codeUrl);
      } else {
        expect(codeLink).not.toBeInTheDocument();
      }
    }
  });
});
