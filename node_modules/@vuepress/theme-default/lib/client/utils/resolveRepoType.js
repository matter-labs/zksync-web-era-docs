import { isLinkHttp } from '@vuepress/shared';
export const resolveRepoType = (repo) => {
    if (!isLinkHttp(repo) || /github\.com/.test(repo))
        return 'GitHub';
    if (/bitbucket\.org/.test(repo))
        return 'Bitbucket';
    if (/gitlab\.com/.test(repo))
        return 'GitLab';
    if (/gitee\.com/.test(repo))
        return 'Gitee';
    return null;
};
