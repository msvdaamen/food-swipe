export type DialogState<T> = {
    isOpen: boolean;
    open: (object?: T) => void
    close: () => void
    data: T | null
}
