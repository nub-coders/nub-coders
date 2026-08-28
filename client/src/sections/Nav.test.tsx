import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Nav from "@/sections/Nav";

// jsdom ships no IntersectionObserver, and the scroll-spy effect constructs one.
// The stub keeps the callback so tests can drive "section came into view".
let observerCallback: IntersectionObserverCallback | null = null;

class CapturingObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

/** Fire the scroll-spy callback as if `id`'s section had scrolled into view. */
function scrollIntoView(id: string) {
  const target = document.getElementById(id);
  observerCallback?.(
    [{ isIntersecting: true, target } as unknown as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
}

beforeEach(() => {
  observerCallback = null;
  vi.stubGlobal("IntersectionObserver", CapturingObserver);
});

// Mirrors the real page order in pages/Home.tsx: Nav is a sibling of both the
// main landmark and the footer, never a descendant of either.
function renderNav() {
  return render(
    <>
      <Nav />
      <main id="main">
        <a href="#somewhere">link behind the overlay</a>
        <section id="about" />
        <section id="tech" />
        <section id="work" />
        <section id="contact" />
      </main>
      <footer>
        <a href="#elsewhere">footer link</a>
      </footer>
    </>,
  );
}

const openMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  const toggle = screen.getByRole("button", { name: "Open navigation menu" });
  await user.click(toggle);
  return screen.getByRole("button", { name: "Close navigation menu" });
};

describe("Nav mobile menu", () => {
  test("closes on Escape and hands focus back to the toggle", async () => {
    const user = userEvent.setup();
    renderNav();

    const toggle = await openMenu(user);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Move focus off the toggle first, otherwise the assertion below would pass
    // trivially: clicking the button already left focus on it.
    await user.tab();
    expect(toggle).not.toHaveFocus();

    await user.keyboard("{Escape}");

    const reopened = screen.getByRole("button", { name: "Open navigation menu" });
    expect(reopened).toHaveAttribute("aria-expanded", "false");
    // Without this, focus would be left on a control that no longer exists in
    // its previous state and the user would restart from the top of the page.
    expect(reopened).toHaveFocus();
  });

  test("makes the page behind the overlay inert while open", async () => {
    const user = userEvent.setup();
    renderNav();

    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    expect(main).not.toHaveAttribute("inert");
    expect(footer).not.toHaveAttribute("inert");

    await openMenu(user);

    // The overlay covers the viewport, so content behind it must leave the tab
    // order — otherwise focus lands on links the user cannot see.
    expect(main).toHaveAttribute("inert");
    expect(footer).toHaveAttribute("inert");
    expect(document.body).toHaveClass("menu-open");

    await user.keyboard("{Escape}");

    expect(main).not.toHaveAttribute("inert");
    expect(footer).not.toHaveAttribute("inert");
    expect(document.body).not.toHaveClass("menu-open");
  });

  test("closes when a nav link is chosen", async () => {
    const user = userEvent.setup();
    renderNav();

    await openMenu(user);
    await user.click(screen.getByRole("link", { name: "work" }));

    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.getElementById("main")).not.toHaveAttribute("inert");
  });
});

describe("Nav links", () => {
  test("points the logo at the main landmark rather than a bare fragment", () => {
    renderNav();

    // href="#" left a stray "#" in the URL and moved focus nowhere.
    const logo = screen.getByRole("link", { name: "nub-coders, back to top" });
    expect(logo).toHaveAttribute("href", "#main");
  });

  test("marks the section in view with aria-current=location", async () => {
    renderNav();

    const work = screen.getByRole("link", { name: "work" });
    expect(work).not.toHaveAttribute("aria-current");

    await act(async () => scrollIntoView("work"));

    // "location" is the current spot within this page; "true" was generic and
    // "page" would have claimed a different page in a set.
    expect(work).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "about" })).not.toHaveAttribute("aria-current");
  });

  test("moves the marker as a different section comes into view", async () => {
    renderNav();

    await act(async () => scrollIntoView("about"));
    expect(screen.getByRole("link", { name: "about" })).toHaveAttribute("aria-current", "location");

    await act(async () => scrollIntoView("contact"));
    expect(screen.getByRole("link", { name: "about" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "contact" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });
});
