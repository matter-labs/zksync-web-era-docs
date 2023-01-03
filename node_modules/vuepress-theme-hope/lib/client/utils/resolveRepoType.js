import { isLinkHttp } from "@vuepress/shared";
export const resolveRepoType = (repo) => !isLinkHttp(repo) || /github\.com/.test(repo)
    ? "GitHub"
    : /bitbucket\.org/.test(repo)
        ? "Bitbucket"
        : /gitlab\.com/.test(repo)
            ? "GitLab"
            : /gitee\.com/.test(repo)
                ? "Gitee"
                : null;
//# sourceMappingURL=resolveRepoType.js.map