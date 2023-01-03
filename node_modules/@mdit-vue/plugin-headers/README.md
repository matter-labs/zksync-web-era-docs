# @mdit-vue/plugin-headers

[![npm](https://badgen.net/npm/v/@mdit-vue/plugin-headers)](https://www.npmjs.com/package/@mdit-vue/plugin-headers)
[![license](https://badgen.net/github/license/mdit-vue/mdit-vue)](https://github.com/mdit-vue/mdit-vue/blob/main/LICENSE)

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin to get markdown headers.

- Extracts all headers info into markdown-it `env.headers`.

## Install

```sh
npm i @mdit-vue/plugin-headers
```

## Usage

```ts
import MarkdownIt from 'markdown-it';
import { headersPlugin } from '@mdit-vue/plugin-headers';
import type { MarkdownItEnv } from '@mdit-vue/types';

const md = MarkdownIt({ html: true }).use(headersPlugin, {
  // options
});
const env: MarkdownItEnv = {};

const rendered = md.render(
  `\
# h1
## h2
### h3
`,
  env,
);

console.log(env.headers);
```

## Options

### format

- Type: `(str: string) => string`

- Details:

  A function for formatting header title.

### level

- Type: `number[]`

- Default: `[2, 3]`

- Details:

  Heading level that going to be extracted.

  When using this plugin with [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) (recommended), this option should be a subset of markdown-it-anchor's `level` option to ensure the header slugs are existed.

### slugify

- Type: `(str: string) => string`

- Default: `slugify` from `@mdit-vue/shared`

- Details:

  A custom slugification function.

  The default slugify function comes from [@mdit-vue/shared](https://github.com/mdit-vue/mdit-vue/tree/main/packages/shared) package.

  When using this plugin with [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) (recommended), this option will be ignored because the `id` of the headings have already been determined by markdown-it-anchor's `slugify` option.
