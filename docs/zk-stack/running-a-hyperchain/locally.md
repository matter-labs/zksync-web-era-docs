---
head:
  - - meta
    - name: "twitter:title"
      content: Deploying Locally | zkSync Docs
---

# Deploying Locally

1. Clone the zksync-era repo (or pull the latest if you've already cloned it) and go to the root of it:

```bash
git clone https://github.com/matter-labs/zksync-era
```

2. Add `ZKSYNC_HOME` to your path (e.g. `~/.bash_profile`, `~/.zshrc` ) - don't forget to source your profile file again (or restart your terminal):

```bash
export ZKSYNC_HOME=/path/to/zksync/repo/you/cloned export PATH=$ZKSYNC_HOME/bin:$PATH
```

3. Build latest version of zk tools by just running `zk` on the root of the project.

```bash
zk
```

4. Last, start the wizard and follow instructions to set up and deploy your new hyperchain by running `zk stack init`

a. Initially you want to `Configure new chain`

b. Give it a name and chain id.

c. Select localhost (default `matterlabs/geth`) and follow the wizard.

- If you are doing this for the first time, several components need to be compiled/built, so do not worry if it takes a few minutes. The console will show what is going on anyways.

d. If you don't want to configure any values for now and just want check the build process for a hyperchain, try out the `zk stack demo` command.

> :warning: The commands above are not just running docker containers, but are actually building the code from the repo to spin up your hyperchain. For this reason the process might take some time. If you just want to run docker containers to play around with a zkSync chain, you can use zksync-cli dev. Learn more here.

Your hyperchain is now deployed to the base chain (most likely a local geth docker container) and configured. You can find all configuration in a new `.env` file created on `<project root>/etc/env/<your_chain_name_slug>.env`, and if you deployed test tokens, their addresses will be available at `<project root>/etc/tokens/<the_l1_identifier>.json`
