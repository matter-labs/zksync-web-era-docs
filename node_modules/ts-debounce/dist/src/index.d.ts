export declare type Options<Result> = {
    isImmediate?: boolean;
    maxWait?: number;
    callback?: (data: Result) => void;
};
export interface DebouncedFunction<Args extends any[], F extends (...args: Args) => any> {
    (this: ThisParameterType<F>, ...args: Args): Promise<ReturnType<F>>;
    cancel: (reason?: any) => void;
}
export declare function debounce<Args extends any[], F extends (...args: Args) => any>(func: F, waitMilliseconds?: number, options?: Options<ReturnType<F>>): {
    (this: ThisParameterType<F>, ...args: Parameters<F> & Args): Promise<ReturnType<F>>;
    cancel: (reason?: any) => void;
};
