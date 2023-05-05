import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  { 
    text: "Home", 
    link: "/" 
  }, 
  { 
    text: "Build", 
    link: "/build/" 
  },
  { 
    text: "Concepts", 
    link: "/concepts/" 
  },
  { 
    text: "Specification", 
    link: "/spec/" 
  },
  { 
    text: "APIs/SDKs", 
    link: "/api/" 
  },
  { 
    text: "Tools", 
    link: "/tools/" 
  },
  { 
    text: "User guides", 
    link: "/user-guides/" 
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
