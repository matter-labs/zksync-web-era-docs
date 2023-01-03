export interface ScrollPromise {
    wait(): Promise<void> | null;
    pending: () => void;
    resolve: () => void;
}
export declare const useScrollPromise: () => ScrollPromise;
