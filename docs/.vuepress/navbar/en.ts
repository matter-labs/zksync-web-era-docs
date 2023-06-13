import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  { 
    text: "Home", 
    link: "/" 
  },
  { 
    text: "Build", 
    link: "/dev/" 
  },
  { 
    text: "Technical Reference", 
    link: "/reference/" 
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
