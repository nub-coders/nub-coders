import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  DiagramLayers,
  DiagramPartNode,
  useInteractiveDiagram,
  type DiagramPart,
} from "@/components/InteractiveDiagram";

const parts = [
  { id: "one", label: "First part", description: "The first movable part.", bounds: { x: 10, y: 10, width: 40, height: 30 } },
  { id: "two", label: "Second part", description: "The second movable part.", bounds: { x: 70, y: 10, width: 40, height: 30 } },
  { id: "three", label: "Third part", description: "The third movable part.", bounds: { x: 50, y: 45, width: 30, height: 20 } },
] as const satisfies readonly DiagramPart[];

function Fixture() {
  const diagram = useInteractiveDiagram(parts, { width: 140, height: 80, title: "Test playground" });
  return (
    <>
      <a href="#before">Before diagram</a>
      <svg {...diagram.svgProps} viewBox="0 0 140 80" role="group" aria-label="Test playground">
        <desc id="test-playground-description">Three example parts.</desc>
        <DiagramLayers diagram={diagram}>
          <DiagramPartNode key="one" diagram={diagram} id="one">
            <rect x="10" y="10" width="40" height="30" />
          </DiagramPartNode>
          {parts.slice(1).map((part) => (
            <DiagramPartNode key={part.id} diagram={diagram} id={part.id}>
              <rect x={part.bounds.x} y={part.bounds.y} width={part.bounds.width} height={part.bounds.height} />
            </DiagramPartNode>
          ))}
        </DiagramLayers>
      </svg>
      <a href="#after">After diagram</a>
    </>
  );
}

function paintOrder() {
  return Array.from(screen.getByRole("group", { name: "Test playground" })
    .querySelectorAll(".diagram-layers > [data-part-id]"))
    .map((part) => part.getAttribute("data-part-id"));
}

function mockCanvasBounds() {
  const svg = screen.getByRole("group", { name: "Test playground" });
  vi.spyOn(svg, "getBoundingClientRect").mockReturnValue({
    x: 0, y: 0, left: 0, top: 0, width: 140, height: 80, right: 140, bottom: 80,
    toJSON: () => ({}),
  });
  return svg;
}

describe("InteractiveDiagram", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test("keeps parts actionable without exposing inspection or help UI", async () => {
    const user = userEvent.setup();
    render(<Fixture />);

    const second = screen.getByRole("button", { name: /Second part/ });
    await user.click(second);

    expect(second).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText("The second movable part.")).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.queryByText(/inspect|drag a part|arrows nudge/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /move selected part/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /pause motion|play motion|reset/i })).not.toBeInTheDocument();
    expect(paintOrder()).toEqual(["one", "three", "two"]);
  });

  test("raises the last clicked part without remounting nodes or changing other positions", () => {
    render(<Fixture />);
    const first = screen.getByRole("button", { name: /First part/ });
    const second = screen.getByRole("button", { name: /Second part/ });
    expect(paintOrder()).toEqual(["one", "two", "three"]);
    expect(first).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(first);
    expect(paintOrder()).toEqual(["two", "three", "one"]);
    fireEvent.click(second);
    expect(paintOrder()).toEqual(["three", "one", "two"]);
    expect(screen.getByRole("button", { name: /First part/ })).toBe(first);
    expect(screen.getByRole("button", { name: /Second part/ })).toBe(second);
    expect(first).toHaveAttribute("transform", "translate(0 0)");
    expect(first).toHaveAttribute("aria-pressed", "false");
    expect(second).toHaveAttribute("aria-pressed", "true");
  });

  test("nudges and raises a focused part without losing keyboard focus", async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const first = screen.getByRole("button", { name: /First part/ });

    act(() => first.focus());
    expect(paintOrder()).toEqual(["two", "three", "one"]);
    await user.keyboard("{ArrowRight}");
    expect(first).toHaveAttribute("transform", "translate(8 0)");

    await user.keyboard("{Shift>}{ArrowDown}{/Shift}");
    expect(first).toHaveAttribute("transform", "translate(8 24)");
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute("aria-pressed", "true");
    expect(paintOrder()).toEqual(["two", "three", "one"]);
  });

  test("keeps motion automatic without exposing playback controls", () => {
    render(<Fixture />);
    const svg = screen.getByRole("group", { name: "Test playground" });
    expect(svg).toHaveAttribute("data-playing", "true");

    fireEvent.click(screen.getByRole("button", { name: /First part/ }));
    expect(svg).toHaveAttribute("data-playing", "true");
  });

  test("tabs through every part in a stable order and exits in both directions", async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const first = screen.getByRole("button", { name: /First part/ });
    const second = screen.getByRole("button", { name: /Second part/ });
    const third = screen.getByRole("button", { name: /Third part/ });

    await user.tab();
    expect(screen.getByRole("link", { name: "Before diagram" })).toHaveFocus();
    for (const part of [first, second, third]) {
      await user.tab();
      expect(part).toHaveFocus();
      expect(part).toHaveAttribute("aria-pressed", "true");
      expect(paintOrder().at(-1)).toBe(part.getAttribute("data-part-id"));
    }
    await user.tab();
    expect(screen.getByRole("link", { name: "After diagram" })).toHaveFocus();

    for (const part of [third, second, first]) {
      await user.tab({ shift: true });
      expect(part).toHaveFocus();
      expect(paintOrder().at(-1)).toBe(part.getAttribute("data-part-id"));
    }
    await user.tab({ shift: true });
    expect(screen.getByRole("link", { name: "Before diagram" })).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
  });

  test("restores focus lost during reordering without raising the old selection again", () => {
    render(<Fixture />);
    const first = screen.getByRole("button", { name: /First part/ });
    const second = screen.getByRole("button", { name: /Second part/ });
    act(() => first.focus());
    const layers = first.parentNode!;
    const appendChild = layers.appendChild.bind(layers);
    vi.spyOn(layers, "appendChild").mockImplementation(<T extends Node>(node: T): T => {
      first.blur();
      return appendChild(node);
    });

    fireEvent.click(second);
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute("aria-pressed", "false");
    expect(second).toHaveAttribute("aria-pressed", "true");
    expect(paintOrder()).toEqual(["three", "one", "two"]);
  });

  test("moves a part with pointer dragging and keeps it inside the canvas", () => {
    render(<Fixture />);
    const svg = mockCanvasBounds();
    const first = screen.getByRole("button", { name: /First part/ });

    fireEvent.pointerDown(first, { pointerId: 1, clientX: 10, clientY: 10 });
    expect(svg).toHaveAttribute("data-dragging", "one");
    expect(paintOrder()).toEqual(["two", "three", "one"]);
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 30, clientY: 20 });
    fireEvent.pointerUp(window, { pointerId: 1, clientX: 30, clientY: 20 });

    expect(first).toHaveAttribute("transform", "translate(20 10)");
    expect(svg).not.toHaveAttribute("data-dragging");
    expect(paintOrder()).toEqual(["two", "three", "one"]);

    fireEvent.pointerDown(first, { pointerId: 1, clientX: 30, clientY: 20 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 900, clientY: 900 });
    fireEvent.pointerUp(window, { pointerId: 1 });
    expect(first).toHaveAttribute("transform", "translate(90 40)");

    fireEvent.pointerMove(window, { pointerId: 1, clientX: 0, clientY: 0 });
    expect(first).toHaveAttribute("transform", "translate(90 40)");

    fireEvent.pointerDown(first, { pointerId: 1, clientX: 30, clientY: 20 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: -900, clientY: -900 });
    fireEvent.pointerUp(window, { pointerId: 1 });
    expect(first).toHaveAttribute("transform", "translate(-10 -10)");
  });

  test("keeps a drag on the captured pointer when another pointer touches a different part", () => {
    render(<Fixture />);
    const svg = mockCanvasBounds();
    const capture = vi.fn();
    const release = vi.fn();
    Object.defineProperties(svg, {
      setPointerCapture: { configurable: true, value: capture },
      hasPointerCapture: { configurable: true, value: () => true },
      releasePointerCapture: { configurable: true, value: release },
    });
    const first = screen.getByRole("button", { name: /First part/ });
    const second = screen.getByRole("button", { name: /Second part/ });

    fireEvent.pointerDown(first, { pointerId: 7, clientX: 10, clientY: 10 });
    expect(capture).toHaveBeenCalledWith(7);
    fireEvent.pointerDown(second, { pointerId: 8, clientX: 70, clientY: 10 });
    fireEvent.pointerMove(window, { pointerId: 8, clientX: 90, clientY: 20 });
    fireEvent.pointerUp(window, { pointerId: 8 });
    expect(svg).toHaveAttribute("data-dragging", "one");
    expect(paintOrder().at(-1)).toBe("one");
    expect(first).toHaveAttribute("transform", "translate(0 0)");
    expect(second).toHaveAttribute("transform", "translate(0 0)");

    fireEvent.pointerMove(window, { pointerId: 7, clientX: 30, clientY: 20 });
    expect(first).toHaveAttribute("transform", "translate(20 10)");
    fireEvent.pointerCancel(window, { pointerId: 7 });
    expect(svg).not.toHaveAttribute("data-dragging");
    expect(release).toHaveBeenCalledWith(7);
    expect(paintOrder().at(-1)).toBe("one");
    fireEvent.pointerMove(window, { pointerId: 7, clientX: 40, clientY: 30 });
    expect(first).toHaveAttribute("transform", "translate(20 10)");
  });

  test("starts still with reduced motion and keeps direct manipulation available", async () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    const user = userEvent.setup();
    render(<Fixture />);
    const svg = screen.getByRole("group", { name: "Test playground" });
    expect(svg).toHaveAttribute("data-playing", "false");
    expect(screen.queryByRole("button", { name: /play motion|pause motion|reset/i })).not.toBeInTheDocument();

    const first = screen.getByRole("button", { name: /First part/ });
    act(() => first.focus());
    await user.keyboard("{ArrowRight}");
    expect(first).toHaveAttribute("transform", "translate(8 0)");
    expect(paintOrder()).toEqual(["two", "three", "one"]);
    expect(svg).toHaveAttribute("data-playing", "false");
  });

  test("stops playback if the motion preference changes during the visit", () => {
    let onChange: (() => void) | undefined;
    const media = {
      matches: false,
      addEventListener: vi.fn((_event: string, callback: () => void) => { onChange = callback; }),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal("matchMedia", vi.fn(() => media));
    const { unmount } = render(<Fixture />);
    const svg = screen.getByRole("group", { name: "Test playground" });
    expect(svg).toHaveAttribute("data-playing", "true");

    act(() => {
      media.matches = true;
      onChange?.();
    });
    expect(svg).toHaveAttribute("data-playing", "false");
    act(() => {
      media.matches = false;
      onChange?.();
    });
    expect(svg).toHaveAttribute("data-playing", "true");
    unmount();
    expect(media.removeEventListener).toHaveBeenCalledWith("change", onChange);
  });
});
