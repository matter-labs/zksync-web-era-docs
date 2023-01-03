# @mdit-vue/plugin-frontmatter

[![npm](https://badgen.net/npm/v/@mdit-vue/plugin-frontmatter)](https://www.npmjs.com/package/@mdit-vue/plugin-frontmatter)
[![license](https://badgen.net/github/license/mdit-vue/mdit-vue)](https://github.com/mdit-vue/mdit-vue/blob/main/LICENSE)

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin to get markdown frontmatter with [gray-matter](https://github.com/jonschlinkert/gray-matter).

- Extracts frontmatter into markdown-it `env.frontmatter`.
- Allows providing default frontmatter via markdown-it `env.frontmatter`.
- Extracts markdown content without frontmatter into markdown-it `env.content`.
- Supports extracting rendered excerpt into markdown-it `env.excerpt`.

## Install

```sh
npm i @mdit-vue/plugin-frontmatter
```

## Usage

```ts
import MarkdownIt from 'markdown-it';
import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter';
import type { MarkdownItEnv } from '@mdit-vue/types';

const md = MarkdownIt({ html: true }).use(frontmatterPlugin, {
  // options
  grayMatterOptions: {
    excerpt: true,
    excerpt_separator: '<!-- more -->',
  },
});
const env: MarkdownItEnv = {};

const rendered = md.render(
  `\
---
title: foobar
---

Everything above **more** comment will be extracted as excerpt.

<!-- more -->

Things below **more** comment will not be included in the excerpt.
`,
  env,
);

console.log(env.frontmatter);
console.log(env.content);
console.log(env.excerpt);
```

## Options

### grayMatterOptions

- Type: `GrayMatterOptions`

- Details:

  Options of [gray-matter](https://github.com/jonschlinkert/gray-matter).

### renderExcerpt

- Type: `boolean`

- Default: `true`

  Render the [excerpt](https://github.com/jonschlinkert/gray-matter#optionsexcerpt) with markdown-it or not.

  This option will only take effects when `grayMatterOptions.excerpt` is enabled (disabled by default) or `grayMatterOptions.excerpt_separator` is set (undefined by default).
