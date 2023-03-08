import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  { 
    text: "Home", 
    link: "/" 
  },
  
  { 
    text: "开发文档", 
    link: "/dev/" 
  },

  { 
    text: "Tools and SDK", 
    link: "/api/" 
  },
  { 
    text: "联系方式", 
    link: "/contact.html" 
  },

  {
    text: "版本",
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
