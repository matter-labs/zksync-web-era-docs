'use strict';

const shared = require('@mdit-vue/shared');

const titlePlugin = (md) => {
  const render = md.renderer.render.bind(md.renderer);
  md.renderer.render = (tokens, options, env) => {
    const tokenIdx = tokens.findIndex((token) => token.tag === "h1");
    env.title = tokenIdx > -1 ? shared.resolveTitleFromToken(tokens[tokenIdx + 1], {
      shouldAllowHtml: false,
      shouldEscapeText: false
    }) : "";
    return render(tokens, options, env);
  };
};

exports.titlePlugin = titlePlugin;
