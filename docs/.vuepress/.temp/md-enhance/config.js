import { defineClientConfig } from "@vuepress/client";
import ChartJS from "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/components/ChartJS.js";
import CodeTabs from "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeTabs.js";
import "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/styles/container/index.scss";
import CodeDemo from "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeDemo.js";
import ECharts from "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/components/ECharts.js";
import "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/styles/figure.scss";
import FlowChart from "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/components/FlowChart.js";
import "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/styles/footnote.scss";
import "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/styles/image-mark.scss";
import Mermaid from "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/components/Mermaid.js";
import Presentation from "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/components/Presentation.js";
import Playground from "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/components/Playground.js";
import Tabs from "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/components/Tabs.js";
import "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/styles/tasklist.scss";
import "/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/styles/katex.scss";
import { defineAsyncComponent } from "vue";


export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("ChartJS", ChartJS);
    app.component("CodeTabs", CodeTabs);
    app.component("CodeDemo", CodeDemo);
    app.component("ECharts", ECharts);
    app.component("FlowChart", FlowChart);
    app.component("Mermaid", Mermaid);
    app.component("Presentation", Presentation);
    app.component("Playground", Playground);
    app.component("Tabs", Tabs);
    app.component("VuePlayground", defineAsyncComponent(() => import("/Users/beveloper/Desktop/projects/zksync-web-v2-docs/node_modules/vuepress-plugin-md-enhance/lib/client/components/VuePlayground.js")));
        
  },
});
