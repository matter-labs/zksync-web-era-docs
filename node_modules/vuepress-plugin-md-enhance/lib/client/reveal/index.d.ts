import * as reveal_js_dist_reveal_esm_js from 'reveal.js/dist/reveal.esm.js';

declare const revealHighlight: () => Promise<typeof reveal_js_dist_reveal_esm_js>;

declare const revealMarkdown: () => Promise<typeof reveal_js_dist_reveal_esm_js>;

declare const revealMath: () => Promise<typeof reveal_js_dist_reveal_esm_js>;

declare const revealNotes: () => Promise<typeof reveal_js_dist_reveal_esm_js>;

declare const reveal: () => Promise<typeof reveal_js_dist_reveal_esm_js>;

declare const revealSearch: () => Promise<typeof reveal_js_dist_reveal_esm_js>;

declare const revealZoom: () => Promise<typeof reveal_js_dist_reveal_esm_js>;

export { reveal, revealHighlight, revealMarkdown, revealMath, revealNotes, revealSearch, revealZoom };
