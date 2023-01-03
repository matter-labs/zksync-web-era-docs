export type RepoType = 'GitHub' | 'GitLab' | 'Gitee' | 'Bitbucket' | null;
export declare const resolveRepoType: (repo: string) => RepoType;
