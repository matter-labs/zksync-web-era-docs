import { execa } from 'execa';
export const getContributors = async (filePaths, cwd) => {
    const { stdout } = await execa('git', ['--no-pager', 'shortlog', '-nes', 'HEAD', '--', ...filePaths], {
        cwd,
        stdin: 'inherit',
    });
    return stdout
        .split('\n')
        .map((item) => item.trim().match(/^(\d+)\t(.*) <(.*)>$/))
        .filter((item) => item !== null)
        .map(([, commits, name, email]) => ({
        name,
        email,
        commits: Number.parseInt(commits, 10),
    }));
};
