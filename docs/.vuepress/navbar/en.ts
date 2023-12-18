import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  { 
    text: "Build", 
    link: "/build" 
  },
  // { 
  //   text: "Build", 
  //   link: "/build" 
  // },
  // { 
  //   text: "Technical Reference", 
  //   link: "/reference/" 
  // }, 
  { 
    text: "Run a Node", 
    link: "/run-a-node/" 
  }, 
  // { 
  //   text: "API/SDKs", 
  //   link: "/api/" 
  // },
  // { 
  //   text: "Tools", 
  //   link: "/tools/" 
  // },
  { 
    text: "ZK Stack", 
    link: "/tools/" 
  },
  // {
  //   text: "Versions",
  //   children: [
  //     {
  //       text: "zkSync Era",
  //       link: "/dev/",
  //     },
  //     {
  //       text: "zkSync Lite",
  //       link: "https://docs.zksync.io",
  //     },
  //   ],
  // }
]);