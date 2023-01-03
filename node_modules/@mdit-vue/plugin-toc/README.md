# @mdit-vue/plugin-toc

[![npm](https://badgen.net/npm/v/@mdit-vue/plugin-toc)](https://www.npmjs.com/package/@mdit-vue/plugin-toc)
[![license](https://badgen.net/github/license/mdit-vue/mdit-vue)](https://github.com/mdit-vue/mdit-vue/blob/main/LICENSE)

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin to generate table-of-contents (TOC) that compatible with [Vue.js](https://vuejs.org).

This plugin is basically a fork of [markdown-it-toc-done-right](https://github.com/nagaozen/markdown-it-toc-done-right), with following enhancement:

- Allows `html_inline` tags in headings to support vue components.
- Supports [containerTag](#containertag), [listTag](#listtag) and [linkTag](#linktag).
- Only allows array in [level](#level) option.
- Code refactor and optimizations.

## Install

```sh
npm i @mdit-vue/plugin-toc
```

## Usage

```ts
import MarkdownIt from 'markdown-it';
import { tocPlugin } from '@mdit-vue/plugin-toc';

const md = MarkdownIt({ html: true }).use(tocPlugin, {
  // options
});
```

## Options

### pattern

- Type: `RegExp`

- Default: `/^\[\[toc\]\]$/i`

- Details:

  The pattern serving as the TOC placeholder in your markdown.

### slugify

- Type: `(str: string) => string`

- Default: `slugify` from `@mdit-vue/shared`

- Details:

  A custom slugification function.

  The default slugify function comes from [@mdit-vue/shared](https://github.com/mdit-vue/mdit-vue/tree/main/packages/shared) package.

  When using this plugin with [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) (recommended), this option will be ignored because the `id` of the headings have already been determined by markdown-it-anchor's `slugify` option.

### format

- Type: `(str: string) => string`

- Details:

  A function for formatting headings.

### level

- Type: `number[]`

- Default: `[2, 3]`

- Details:

  Heading level that going to be included in the TOC.

  When using this plugin with [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) (recommended), this option should be a subset of markdown-it-anchor's `level` option to ensure the target links are existed.

### containerTag

- Type: `string`

- Default: `'nav'`

- Details:

  HTML tag of the TOC container.

### containerClass

- Type: `string`

- Default: `'table-of-contents'`

- Details:

  The class for the TOC container.

### listTag

- Type: `'ul' | 'ol'`

- Default: `'ul'`

- Details:

  HTML tag of the TOC list.

### listClass

- Type: `string`

- Default: `''`

- Details:

  The class for the TOC list.

### itemClass

- Type: `string`

- Default: `''`

- Details:

  The class for the `<li>` tag.

### linkTag

- Type: `'a' | 'router-link'`

- Default: `'a'`

- Details:

  The tag of the link inside the `<li>` tag.

  You can set this option to render to links as [vue-router's router-link](https://router.vuejs.org/guide/#html).

### linkClass

- Type: `string`

- Default: `''`

- Details:

  The class for the link inside the `<li>` tag.
