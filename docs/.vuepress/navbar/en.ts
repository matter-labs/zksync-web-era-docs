import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  { 
    text: "Home", 
    link: "/" 
  },
  { 
    text: "Developer Docs", 
    link: "/dev/" 
  },
  { 
    text: "Tools/SDKs", 
    link: "/api/" 
  },
  { 
    text: "Contacts and Links", 
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
        text: "zkSync lite",
        link: "https://docs.zksync.io",
      },
    ],
  }
]);
