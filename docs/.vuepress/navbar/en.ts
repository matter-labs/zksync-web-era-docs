import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  { 
    text: "Home", 
    link: "/" 
  },
  { 
    text: "Quickstart", 
    link: "/dev/developer-guides/hello-world.html" 
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
    text: "v2.0",
    children: [
      {
        text: "zkSync Era",
        icon: "play",
        link: "/dev/",
      },
      {
        text: "zkSync lite",
        icon: "play",
        link: "https://docs.zksync.io",
      },
    ],
  }
]);
