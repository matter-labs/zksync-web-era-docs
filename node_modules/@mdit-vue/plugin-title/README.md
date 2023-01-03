# @mdit-vue/plugin-title

[![npm](https://badgen.net/npm/v/@mdit-vue/plugin-title)](https://www.npmjs.com/package/@mdit-vue/plugin-title)
[![license](https://badgen.net/github/license/mdit-vue/mdit-vue)](https://github.com/mdit-vue/mdit-vue/blob/main/LICENSE)

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin to get page title.

- Extracts title (the content of the first level-1 heading) into markdown-it `env.title`.

## Install

```sh
npm i @mdit-vue/plugin-title
```

## Usage

```ts
import MarkdownIt from 'markdown-it';
import { titlePlugin } from '@mdit-vue/plugin-title';
import type { MarkdownItEnv } from '@mdit-vue/types';

const md = MarkdownIt({ html: true }).use(titlePlugin);
const env: MarkdownItEnv = {};

const rendered = md.render(
  `\
# h1
## h2
### h3
`,
  env,
);

console.log(env.title);
```
