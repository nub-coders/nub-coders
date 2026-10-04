import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from "react";
import "./InteractiveDiagram.css";

export type DiagramPart = {
  id: string;
  label: string;
  description: string;
  bounds: { x: number; y: number; width: number; height: number };
};

type Point = { x: number; y: number };
type Offset = Point;

export type InteractiveDiagram = {
  parts: readonly DiagramPart[];
  selectedId: string;
  playing: boolean;
  reducedMotion: boolean;
  draggingId: string | null;
  svgProps: SVGProps<SVGSVGElement> & {
    "data-playing": "true" | "false";
    "data-dragging": string | undefined;
  };
  partOrder: readonly string[];
  point: (id: string, x: number, y: number) => Point;
  select: (id: string) => void;
  nudge: (id: string, dx: number, dy: number) => void;
  startDrag: (id: string, event: ReactPointerEvent<SVGGElement>) => void;
};

type DiagramOptions = {
  width: number;
  height: number;
  title: string;
};

type DragState = {
  id: string;
  pointerId: number;
  startClient: Point;
  startOffset: Offset;
};

const EMPTY_OFFSET: Offset = { x: 0, y: 0 };

function getInitialMotionPreference() {
  return typeof window === "undefined" || typeof window.matchMedia !== "function"
    ? false
    : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clampOffset(part: DiagramPart, offset: Offset, width: number, height: number): Offset {
  return {
    x: Math.max(-part.bounds.x, Math.min(width - part.bounds.x - part.bounds.width, offset.x)),
    y: Math.max(-part.bounds.y, Math.min(height - part.bounds.y - part.bounds.height, offset.y)),
  };
}

function offsetMap(parts: readonly DiagramPart[]) {
  return Object.fromEntries(parts.map((part) => [part.id, EMPTY_OFFSET])) as Record<string, Offset>;
}

function normalizePartOrder(parts: readonly DiagramPart[], order: readonly string[]) {
  const remainingIds = new Set(parts.map((part) => part.id));
  const orderedIds = order.filter((id) => remainingIds.delete(id));
  return [...orderedIds, ...Array.from(remainingIds)];
}

export function diagramConnection(from: Point, to: Point) {
  const bend = Math.max(18, Math.min(90, Math.abs(to.x - from.x) * 0.45));
  const direction = to.x >= from.x ? 1 : -1;
  return `M ${from.x} ${from.y} C ${from.x + bend * direction} ${from.y}, ${to.x - bend * direction} ${to.y}, ${to.x} ${to.y}`;
}

export function useInteractiveDiagram(
  parts: readonly DiagramPart[],
  options: DiagramOptions,
): InteractiveDiagram {
  const [selectedId, setSelectedId] = useState("");
  const [partOrderState, setPartOrderState] = useState(() => parts.map((part) => part.id));
  const [offsets, setOffsets] = useState<Record<string, Offset>>(() => offsetMap(parts));
  const [reducedMotion, setReducedMotion] = useState(getInitialMotionPreference);
  const playing = !reducedMotion;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const focusedPartRef = useRef<SVGGElement | null>(null);
  const restoringFocusRef = useRef(false);

  const rememberFocus = useCallback(() => {
    const svg = svgRef.current;
    const active = svg?.ownerDocument.activeElement;
    const part = active?.closest<SVGGElement>(".diagram-part");
    focusedPartRef.current = part && svg?.contains(part) ? part : null;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
    };
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const stopDragging = () => {
      const drag = dragRef.current;
      const svg = svgRef.current;
      if (drag && svg?.hasPointerCapture?.(drag.pointerId)) {
        svg.releasePointerCapture(drag.pointerId);
      }
      dragRef.current = null;
      setDraggingId(null);
    };
    const move = (event: PointerEvent) => {
      const drag = dragRef.current;
      const svg = svgRef.current;
      if (!drag || drag.pointerId !== event.pointerId || !svg) return;
      const bounds = svg.getBoundingClientRect();
      const scaleX = options.width / Math.max(1, bounds.width);
      const scaleY = options.height / Math.max(1, bounds.height);
      const part = parts.find((item) => item.id === drag.id);
      if (!part) return;
      const next = clampOffset(
        part,
        {
          x: drag.startOffset.x + (event.clientX - drag.startClient.x) * scaleX,
          y: drag.startOffset.y + (event.clientY - drag.startClient.y) * scaleY,
        },
        options.width,
        options.height,
      );
      setOffsets((current) => ({ ...current, [drag.id]: next }));
    };
    const endDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      stopDragging();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [options.height, options.width, parts]);

  const partOrder = useMemo(() => normalizePartOrder(parts, partOrderState), [partOrderState, parts]);

  const raisePart = useCallback((id: string) => {
    if (!parts.some((part) => part.id === id)) return;
    rememberFocus();
    setPartOrderState((current) => {
      const ordered = normalizePartOrder(parts, current);
      const next = [...ordered.filter((partId) => partId !== id), id];
      return next.every((partId, index) => partId === current[index]) && next.length === current.length
        ? current
        : next;
    });
  }, [parts, rememberFocus]);

  const select = useCallback((id: string) => {
    if (restoringFocusRef.current || !parts.some((part) => part.id === id)) return;
    setSelectedId(id);
    raisePart(id);
  }, [parts, raisePart]);

  useLayoutEffect(() => {
    const focusedPart = focusedPartRef.current;
    focusedPartRef.current = null;
    if (!focusedPart?.isConnected || focusedPart.ownerDocument.activeElement === focusedPart) return;
    // Moving a keyed SVG group can blur it; restore focus without selecting it again.
    restoringFocusRef.current = true;
    try {
      focusedPart.focus({ preventScroll: true });
    } finally {
      restoringFocusRef.current = false;
    }
  }, [partOrder]);

  const nudge = useCallback((id: string, dx: number, dy: number) => {
    const part = parts.find((item) => item.id === id);
    if (!part) return;
    setSelectedId(id);
    raisePart(id);
    setOffsets((current) => ({
      ...current,
      [id]: clampOffset(part, {
        x: (current[id]?.x ?? 0) + dx,
        y: (current[id]?.y ?? 0) + dy,
      }, options.width, options.height),
    }));
  }, [options.height, options.width, parts, raisePart]);

  const startDrag = useCallback((id: string, event: ReactPointerEvent<SVGGElement>) => {
    if (dragRef.current) {
      event.preventDefault();
      return;
    }
    const part = parts.find((item) => item.id === id);
    if (!part) return;
    event.preventDefault();
    setSelectedId(id);
    raisePart(id);
    setDraggingId(id);
    dragRef.current = {
      id,
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startOffset: offsets[id] ?? EMPTY_OFFSET,
    };
    // Capture on the SVG root, which stays in place while its keyed parts reorder.
    try {
      svgRef.current?.setPointerCapture?.(event.pointerId);
    } catch {
      // Window listeners still handle dragging if pointer capture is unavailable.
    }
  }, [offsets, parts, raisePart]);

  const point = useCallback((id: string, x: number, y: number) => ({
    x: x + (offsets[id]?.x ?? 0),
    y: y + (offsets[id]?.y ?? 0),
  }), [offsets]);

  const descriptionId = `${options.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-description`;

  const svgProps = useMemo(() => ({
    ref: svgRef,
    className: "diagram-svg",
    "data-playing": playing ? "true" as const : "false" as const,
    "data-dragging": draggingId ?? undefined,
    "aria-describedby": descriptionId,
  }), [descriptionId, draggingId, playing]);

  return {
    parts,
    selectedId,
    playing,
    reducedMotion,
    draggingId,
    svgProps,
    partOrder,
    point,
    select,
    nudge,
    startDrag,
  };
}

type DiagramPartElement = ReactElement<{ id: string }>;
const DiagramLayerContext = createContext(false);

function isDiagramPartElement(child: ReactNode): child is DiagramPartElement {
  return isValidElement<{ id: string }>(child)
    && child.type === DiagramPartNode
    && typeof child.props.id === "string";
}

export function DiagramLayers({
  diagram,
  children,
}: {
  diagram: InteractiveDiagram;
  children: ReactNode;
}) {
  const layersRef = useRef<SVGGElement | null>(null);
  const flattenedChildren = Children.toArray(children);
  const movableChildren = flattenedChildren.filter(isDiagramPartElement);
  const originalIndexes = new Map(movableChildren.map((child, index) => [child.props.id, index]));
  const orderIndexes = new Map(diagram.partOrder.map((id, index) => [id, index]));
  const orderedMovableChildren = [...movableChildren].sort((left, right) => {
    const leftOrder = orderIndexes.get(left.props.id) ?? diagram.partOrder.length + (originalIndexes.get(left.props.id) ?? 0);
    const rightOrder = orderIndexes.get(right.props.id) ?? diagram.partOrder.length + (originalIndexes.get(right.props.id) ?? 0);
    return leftOrder - rightOrder;
  });
  let movableIndex = 0;
  const orderedChildren = flattenedChildren.map((child) => (
    isDiagramPartElement(child) ? orderedMovableChildren[movableIndex++] : child
  ));

  const orderedTabParts = () => {
    const nodes = new Map(Array.from(layersRef.current?.querySelectorAll<SVGGElement>(".diagram-part") ?? [])
      .map((part) => [part.dataset.partId, part]));
    return diagram.parts.map((part) => nodes.get(part.id)).filter((part): part is SVGGElement => Boolean(part));
  };

  const onFocus = (event: ReactFocusEvent<SVGGElement>) => {
    const layers = event.currentTarget;
    // The layer is the sole natural tab entry; parts traverse in metadata order.
    layers.tabIndex = -1;
    if (event.target !== layers) return;
    const parts = orderedTabParts();
    const from = event.relatedTarget;
    const enteringBackward = from instanceof Node && !layers.contains(from)
      && Boolean(layers.compareDocumentPosition(from) & Node.DOCUMENT_POSITION_FOLLOWING);
    const part = enteringBackward ? parts[parts.length - 1] : parts[0];
    if (part) part.focus({ preventScroll: true });
    else layers.tabIndex = 0;
  };

  const onBlur = (event: ReactFocusEvent<SVGGElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
      event.currentTarget.tabIndex = 0;
    }
  };

  const onKeyDown = (event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key !== "Tab" || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const activePart = event.target instanceof Element ? event.target.closest<SVGGElement>(".diagram-part") : null;
    const parts = orderedTabParts();
    const index = parts.findIndex((part) => part === activePart);
    if (index < 0) return;
    const next = parts[index + (event.shiftKey ? -1 : 1)];
    // At either boundary all layer tab stops are negative, so the browser exits naturally.
    if (!next) return;
    event.preventDefault();
    next.focus({ preventScroll: true });
  };

  return (
    <g ref={layersRef} className="diagram-layers" tabIndex={0} onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown}>
      <DiagramLayerContext.Provider value={true}>
        {orderedChildren}
      </DiagramLayerContext.Provider>
    </g>
  );
}

export function DiagramPartNode({
  diagram,
  id,
  children,
}: {
  diagram: InteractiveDiagram;
  id: string;
  children: ReactNode;
}) {
  const layerManaged = useContext(DiagramLayerContext);
  const part = diagram.parts.find((item) => item.id === id);
  if (!part) return <>{children}</>;

  const selected = diagram.selectedId === id;
  const offset = diagram.point(id, 0, 0);

  const onKeyDown = (event: ReactKeyboardEvent<SVGGElement>) => {
    const step = event.shiftKey ? 24 : 8;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      diagram.select(id);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      diagram.nudge(
        id,
        event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0,
        event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0,
      );
    }
  };

  return (
    <g
      className="diagram-part"
      data-part-id={id}
      transform={`translate(${offset.x} ${offset.y})`}
      role="button"
      tabIndex={layerManaged ? -1 : 0}
      aria-label={`${part.label}. ${part.description}`}
      aria-pressed={selected}
      onClick={() => {
        if (!diagram.draggingId) diagram.select(id);
      }}
      onPointerDown={(event) => diagram.startDrag(id, event)}
      onFocus={() => diagram.select(id)}
      onKeyDown={onKeyDown}
    >
      {children}
      <rect
        className="diagram-part-hit"
        x={part.bounds.x}
        y={part.bounds.y}
        width={part.bounds.width}
        height={part.bounds.height}
        rx={8}
        aria-hidden="true"
      />
    </g>
  );
}
