import { expect, test } from "bun:test";
import { reducer } from "./use-toast";

// Helper to create a toast
const createToast = (id: string) => ({
  id,
  title: `Toast ${id}`,
  open: true,
});

test("reducer ADD_TOAST adds a toast and respects TOAST_LIMIT", () => {
  const initialState = { toasts: [] };
  const toast = createToast("1");
  const action = { type: "ADD_TOAST", toast } as const;

  const newState = reducer(initialState as any, action as any);

  expect(newState.toasts).toHaveLength(1);
  expect(newState.toasts[0]).toEqual(toast);

  // Test TOAST_LIMIT (which is 1)
  const toast2 = createToast("2");
  const action2 = { type: "ADD_TOAST", toast: toast2 } as const;
  const newState2 = reducer(newState, action2 as any);

  expect(newState2.toasts).toHaveLength(1);
  expect(newState2.toasts[0]).toEqual(toast2);
});

test("reducer UPDATE_TOAST updates an existing toast", () => {
  const toast1 = createToast("1");
  const initialState = { toasts: [toast1] };
  const updatedToast = { id: "1", title: "Updated Title" };
  const action = { type: "UPDATE_TOAST", toast: updatedToast } as const;

  const newState = reducer(initialState as any, action as any);

  expect(newState.toasts).toHaveLength(1);
  expect(newState.toasts[0].title).toBe("Updated Title");
  expect(newState.toasts[0].id).toBe("1");
  expect(newState.toasts[0].open).toBe(true); // preserved from original
});

test("reducer DISMISS_TOAST sets open to false for a specific toast", () => {
  const toast1 = createToast("1");
  const initialState = { toasts: [toast1] };
  const action = { type: "DISMISS_TOAST", toastId: "1" } as const;

  const newState = reducer(initialState as any, action as any);

  expect(newState.toasts).toHaveLength(1);
  expect(newState.toasts[0].open).toBe(false);
});

test("reducer DISMISS_TOAST sets open to false for all toasts when no ID is provided", () => {
  const toast1 = createToast("1");
  const toast2 = createToast("2");
  // Manually setting state with 2 toasts to verify dismiss all behavior,
  // even if TOAST_LIMIT is normally 1
  const initialState = { toasts: [toast1, toast2] };
  const action = { type: "DISMISS_TOAST" } as const;

  const newState = reducer(initialState as any, action as any);

  expect(newState.toasts).toHaveLength(2);
  expect(newState.toasts[0].open).toBe(false);
  expect(newState.toasts[1].open).toBe(false);
});

test("reducer REMOVE_TOAST removes a specific toast", () => {
  const toast1 = createToast("1");
  const toast2 = createToast("2");
  const initialState = { toasts: [toast1, toast2] };
  const action = { type: "REMOVE_TOAST", toastId: "1" } as const;

  const newState = reducer(initialState as any, action as any);

  expect(newState.toasts).toHaveLength(1);
  expect(newState.toasts[0].id).toBe("2");
});

test("reducer REMOVE_TOAST removes all toasts when no ID is provided", () => {
  const toast1 = createToast("1");
  const toast2 = createToast("2");
  const initialState = { toasts: [toast1, toast2] };
  const action = { type: "REMOVE_TOAST" } as const;

  const newState = reducer(initialState as any, action as any);

  expect(newState.toasts).toHaveLength(0);
});
