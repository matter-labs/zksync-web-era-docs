import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/zh/": [
    "",
    {
      icon: "discover",
      text: "lang",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
  ],
});
