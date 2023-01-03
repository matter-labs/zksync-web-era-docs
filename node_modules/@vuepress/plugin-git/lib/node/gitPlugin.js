import { path } from '@vuepress/utils';
import { checkGitRepo, getContributors, getCreatedTime, getUpdatedTime, } from './utils/index.js';
export const gitPlugin = ({ createdTime, updatedTime, contributors } = {}) => (app) => {
    const cwd = app.dir.source();
    const isGitRepoValid = checkGitRepo(cwd);
    return {
        name: '@vuepress/plugin-git',
        extendsPage: async (page) => {
            page.data.git = {};
            if (!isGitRepoValid || page.filePathRelative === null) {
                return;
            }
            const filePaths = [
                page.filePathRelative,
                ...(page.frontmatter.gitInclude ?? []).map((item) => path.join(page.filePathRelative, '..', item)),
            ];
            if (createdTime !== false) {
                page.data.git.createdTime = await getCreatedTime(filePaths, cwd);
            }
            if (updatedTime !== false) {
                page.data.git.updatedTime = await getUpdatedTime(filePaths, cwd);
            }
            if (contributors !== false) {
                page.data.git.contributors = await getContributors(filePaths, cwd);
            }
        },
    };
};
