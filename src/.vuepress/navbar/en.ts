import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  { 
    text: "Developer Docs", 
    link: "/dev/" 
  },
  { 
    text: "Tools/SDKs", 
    link: "/api/" 
  },
  { 
    text: "Contact", 
    link: "/contact.html" 
  },
  {
    text: "Docs",
    link: "/api/",
    children: [
      {
        text: "v2.0",
        icon: "play",
        link: "/dev/",
      },
      {
        text: "v1.x",
        icon: "play",
        link: "https://docs.zksync.io",
      },
    ],
  },
  {
    text: "Community",
    link: "/api/",
    children: [
      {
        text: "Discord",
        icon: "group",
        link: "/dev/",
      },
      {
        text: "Twitter",
        icon: "leaf",
        link: "/dev/",
      },
      {
        text: "Medium",
        icon: "wechat",
        link: "https://docs.zksync.io",
      },
    ],
  },
]);
