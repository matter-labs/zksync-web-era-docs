export type Highlighter = (code: string) => string;
/**
 * Resolve syntax highlighter for corresponding language
 */
export declare const resolveHighlighter: (language: string) => Highlighter | null;
