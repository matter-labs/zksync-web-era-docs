---
head:
  - - meta
    - name: "twitter:title"
      content: Troubleshooting zkSync CLI | zkSync Docs
---

# Troubleshooting zkSync CLI

Encountering issues with zkSync CLI? Here are some common problems and step-by-step recommendations for resolving them:

<details>
<summary><strong>`unknown command` Error</strong></summary>

If you encounter an `unknown command` error, follow these steps:

a. **Check the zkSync CLI Version**

- Run `npx zksync-cli --version` to check your current version.
- Compare it with the latest version available on [npm](https://www.npmjs.com/package/zksync-cli).
- If your version is lower than the one on npm, follow the steps below. If your version is up-to-date, it's possible that the command was moved or renamed. Use `npx zksync-cli help` for a list of current commands or refer to the documentation.

b. **Verify Local Installation**

- Use `npm list zksync-cli` to check if `zksync-cli` is installed in the current directory or any parent directories from where you are running your terminal.
- If it is indeed installed, make sure to uninstall it by running `npm uninstall zksync-cli` in its installation location. Remove all instances of `zksync-cli` until none are found by `npm list zksync-cli`.

c. **Verify Global Installation**

- Use `npm list -g zksync-cli` to check if `zksync-cli` is installed globally.
- If it is installed globally, uninstall it using `npm uninstall -g zksync-cli`.

d. **Clean npm Cache**

- Run `npm cache clean --force`.

e. **Use the Latest Version**

- As a quick fix, or if the above steps don't resolve the issue, use `npx zksync-cli@latest [command]`, for example, `npx zksync-cli@latest dev start`.

</details>

<br />

<details>
<summary><strong>My Version is Outdated</strong></summary>

If `npx zksync-cli` is not running the latest version:

- Refer to the guide above to check and update your zkSync CLI version.

</details>

<br />

<details>
<summary><strong>`command not found: npx` Error</strong></summary>

If you receive a `command not found: npx` error, it means Node.js is not installed or not correctly set up on your system:

- Install Node.js from [https://nodejs.org/](https://nodejs.org/). This will also install `npm` and `npx`.
- After installation, restart your terminal and try running `npx zksync-cli` again.

</details>

For all other issues, we encourage you to seek help or report them in our [GitHub Discussions](https://github.com/zkSync-Community-Hub/zksync-developers/discussions/new?category=general&title=[zksync-cli]%20<Title>).
