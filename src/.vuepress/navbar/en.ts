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
    text: "v2.0",
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
]);
