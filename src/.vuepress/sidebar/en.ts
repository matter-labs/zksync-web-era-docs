import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    "",
    {
      icon: "discover",
      text: "Introduction",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "Getting started",
      icon: "note",
      prefix: "guide/",
      children: "structure",
    },
    "slides",
  ],
});
