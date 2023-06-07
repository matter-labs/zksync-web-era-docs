import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  { 
    text: "Home", 
    link: "/" 
  },
  { 
    text: "Developer docs", 
    link: "/dev/" 
  },
  { 
    text: "API/SDKs", 
    link: "/api/" 
  },
  { 
    text: "Tools", 
    link: "/tools/" 
  },
  {
    text: "Versions",
    children: [
      {
        text: "zkSync Era",
        link: "/dev/",
      },
      {
        text: "zkSync Lite",
        link: "https://docs.zksync.io",
      },
    ],
  }
]);
