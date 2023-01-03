import { withBase } from "@vuepress/client";
import { isLinkHttp } from "@vuepress/shared";
import { h, resolveComponent } from "vue";
const Icon = (props) => {
    const { icon = "" } = props;
    return isLinkHttp(icon)
        ? h("img", { class: "icon", src: icon })
        : icon.startsWith("/")
            ? h("img", { class: "icon", src: withBase(icon) })
            : h(resolveComponent("FontIcon"), props);
};
Icon.displayName = "Icon";
export default Icon;
//# sourceMappingURL=Icon.js.map