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
    text: "Tools and SDK", 
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
        text: "zkSync Lite",
        link: "https://docs.zksync.io",
      },
    ],
  }
]);
