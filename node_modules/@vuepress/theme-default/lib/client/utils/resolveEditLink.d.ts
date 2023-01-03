import type { RepoType } from './resolveRepoType.js';
export declare const editLinkPatterns: Record<Exclude<RepoType, null>, string>;
export declare const resolveEditLink: ({ docsRepo, docsBranch, docsDir, filePathRelative, editLinkPattern, }: {
    docsRepo: string;
    docsBranch: string;
    docsDir: string;
    filePathRelative: string | null;
    editLinkPattern?: string | undefined;
}) => string | null;
