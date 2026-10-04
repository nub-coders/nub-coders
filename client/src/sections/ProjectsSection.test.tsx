import { fireEvent, render, screen, within } from "@testing-library/react";
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

  test("keeps a dragged container's route attached after bringing it to the foreground", () => {
    render(<ProjectsSection />);
    const svg = screen.getByRole("group", { name: "Halvo playground" });
    Object.defineProperty(svg, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ left: 0, top: 0, width: 520, height: 300, right: 520, bottom: 300 }),
    });
    const packets = Array.from(svg.querySelectorAll(".diagram-packet"));
    const originalRoutes = packets.map((packet) => packet.getAttribute("d"));
    const web = within(svg).getByRole("button", { name: /^Web container\./ });
    expect(packets).toHaveLength(4);

    fireEvent.pointerDown(web, { pointerId: 3, clientX: 407, clientY: 83 });
    fireEvent.pointerMove(window, { pointerId: 3, clientX: 375, clientY: 95 });
    fireEvent.pointerUp(window, { pointerId: 3 });
    expect(web).toHaveAttribute("transform", "translate(-32 12)");
    expect(web.parentElement?.lastElementChild).toBe(web);
    expect(packets[1].getAttribute("d")).not.toBe(originalRoutes[1]);
    expect(packets[1].getAttribute("d")).toMatch(/375 95$/);
    for (const index of [0, 2, 3]) {
      expect(packets[index]).toHaveAttribute("d", originalRoutes[index]);
    }

    fireEvent.click(within(svg).getByRole("button", { name: /^Worker container\./ }));
    expect(web).toHaveAttribute("transform", "translate(-32 12)");
    expect(packets[1].getAttribute("d")).toMatch(/375 95$/);
  });
});
