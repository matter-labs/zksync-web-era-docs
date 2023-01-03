import { defineClientConfig } from '@vuepress/client';
import { h } from 'vue';
import { ExternalLinkIcon } from './components/index.js';
const locales = __EXTERNAL_LINK_ICON_LOCALES__;
export default defineClientConfig({
    enhance({ app }) {
        // wrap the `<ExternalLinkIcon />` component with plugin options
        app.component('ExternalLinkIcon', h(ExternalLinkIcon, { locales }));
    },
});
