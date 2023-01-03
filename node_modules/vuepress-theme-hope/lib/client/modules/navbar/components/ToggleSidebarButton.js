import { h } from "vue";
import "../styles/toggle-sidebar-button.scss";
const ToggleSidebarButton = (_, { emit }) => h("button", {
    class: "toggle-sidebar-button",
    title: "Toggle Sidebar",
    onClick: () => emit("toggle"),
}, h("span", { class: "icon" }));
ToggleSidebarButton.displayName = "ToggleSidebarButton";
ToggleSidebarButton.emits = ["toggle"];
export default ToggleSidebarButton;
//# sourceMappingURL=ToggleSidebarButton.js.map