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
    text: "Concepts", 
    link: "/concepts/" 
  },
  { 
    text: "APIs", 
    link: "/api/" 
  },
  { 
    text: "Footer", 
    link: "/contact.html" 
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
