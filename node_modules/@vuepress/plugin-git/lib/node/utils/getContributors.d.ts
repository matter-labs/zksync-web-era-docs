import type { GitContributor } from '../types.js';
export declare const getContributors: (filePaths: string[], cwd: string) => Promise<GitContributor[]>;
