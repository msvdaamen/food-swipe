import { create } from "zustand";

type DialogState<T = null> = {
  isOpen: boolean;
  data: [T] extends [null] ? null : T | null;
  onClose: () => void;
  open: (...args: [T] extends [null] ? [] : [data: T]) => void;
};

export function createDialogState<T = null>() {
  return create<DialogState<T>>()((set) => ({
    isOpen: false,
    data: null as DialogState<T>["data"],
    onClose: () => {
      set({ isOpen: false, data: null as DialogState<T>["data"] });
    },
    open: (...args) => {
      set({
        isOpen: true,
        data: (args[0] ?? null) as DialogState<T>["data"]
      });
    }
  }));
}
