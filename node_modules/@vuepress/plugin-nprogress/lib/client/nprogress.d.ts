/**
 * NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT
 */
interface NProgressOptions {
    minimum: number;
    template: string;
    easing: string;
    speed: number;
    trickle: boolean;
    trickleRate: number;
    trickleSpeed: number;
    parent: string;
    barSelector: string;
}
interface NProgress {
    settings: NProgressOptions;
    status: number | null;
    set(number: number): NProgress;
    isStarted(): boolean;
    start(): NProgress;
    done(force?: boolean): NProgress;
    inc(amount?: number): NProgress;
    trickle(): NProgress;
    render(fromStart?: boolean): HTMLDivElement;
    remove(): void;
    isRendered(): boolean;
}
export declare const nprogress: NProgress;
export {};
