import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { projects } from "@/data/projects";

describe("redesigned home", () => {
  test("offers work and contact actions with actual section targets", () => {
    render(<Home />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Built with care.");
    for (const name of ["Explore our work", "Let’s talk", "Skip to content"]) {
      const href = screen.getByRole("link", { name }).getAttribute("href");
      expect(href?.startsWith("#")).toBe(true);
      expect(document.getElementById(href!.slice(1))).not.toBeNull();
    }
  });

  test("renders the work before the studio and makes titles real links", () => {
    render(<Home />);
    const work = screen.getByRole("region", { name: "Selected Work" });
    const about = screen.getByRole("region", { name: "About" });
    expect(work.compareDocumentPosition(about) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    for (const project of projects) {
      const titleLink = within(work).getByRole("link", { name: project.name });
      expect(titleLink).toHaveAttribute("href", project.liveUrl);
      expect(titleLink).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  test("does not hide content behind scroll reveal or claim diagrams are live data", () => {
    const { container } = render(<Home />);
    expect(container.querySelector(".reveal")).toBeNull();
    expect(screen.getByText("Illustrative architecture")).toBeInTheDocument();
    expect(screen.getAllByText("Concept")).toHaveLength(projects.length);
    expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
  });

  test("brings the last selected part above all artwork in each diagram without motion or reset buttons", () => {
    render(<Home />);
    expect(screen.queryByRole("button", { name: /pause motion|play motion|^reset$/i })).not.toBeInTheDocument();

    for (const name of [
      "Architecture playground", "Halvo playground", "NubMail playground",
      "Nub Music Bot playground", "Ytube API playground",
    ]) {
      const diagram = screen.getByRole("group", { name });
      const nodes = within(diagram).getAllByRole("button");
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const layers = first.parentElement!;
      expect(diagram.lastElementChild).toBe(layers);
      expect(layers).toHaveClass("diagram-layers");

      fireEvent.click(first);
      expect(layers.lastElementChild).toBe(first);
      fireEvent.click(last);
      expect(layers.lastElementChild).toBe(last);
      expect(first).toHaveAttribute("aria-pressed", "false");
      expect(last).toHaveAttribute("aria-pressed", "true");
      expect(first).toHaveAttribute("transform", "translate(0 0)");
      expect(last).toHaveAttribute("transform", "translate(0 0)");
    }
  });

  test("uses the traditional shared logo in both brand links", () => {
    render(<Home />);
    const brandLinks = screen.getAllByRole("link", { name: /back to top/i })
      .filter((link) => /nub.coders/i.test(link.getAttribute("aria-label") ?? ""));
    expect(brandLinks).toHaveLength(2);
    for (const link of brandLinks) {
      const logo = link.querySelector("img");
      expect(logo).toHaveAttribute("src", "/logo.svg?v=traditional");
      expect(logo).toHaveAttribute("alt", "");
      expect(logo?.getAttribute("width")).toBe(logo?.getAttribute("height"));
      expect(link).toHaveAttribute("href", "#main");
    }
  });
});

describe("redesigned not-found page", () => {
  test("has an accessible heading and a working home route", () => {
    render(<NotFound />);
    expect(screen.getByRole("main")).toHaveAccessibleName("Page not found.");
    expect(screen.getByRole("link", { name: /back home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute("href", "mailto:dev@nubcoders.com");
    expect(screen.getByRole("link", { name: "Nub Coders home" }).querySelector("img"))
      .toHaveAttribute("src", "/logo.svg?v=traditional");
  });
});
