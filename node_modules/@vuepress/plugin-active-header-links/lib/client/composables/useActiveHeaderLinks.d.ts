export interface UseActiveHeaderLinksOptions {
    headerLinkSelector: string;
    headerAnchorSelector: string;
    delay: number;
    offset?: number;
}
export declare const useActiveHeaderLinks: ({ headerLinkSelector, headerAnchorSelector, delay, offset, }: UseActiveHeaderLinksOptions) => void;
