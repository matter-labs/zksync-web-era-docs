// .vuepress/client.ts
import { defineClientConfig } from "@vuepress/client";
import Footer from "./components/Footer.vue";

export default defineClientConfig({
    enhance: ({ app, router, siteData }) => {
        app.component("Footer", Footer);
    },
});
