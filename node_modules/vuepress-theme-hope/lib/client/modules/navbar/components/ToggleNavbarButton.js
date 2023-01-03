import { h } from "vue";
import "../styles/toggle-navbar-button.scss";
const ToggleNavbarButton = ({ active = false }, { emit }) => h("button", {
    class: ["toggle-navbar-button", { "is-active": active }],
    "aria-label": "Toggle Navbar",
    "aria-expanded": active,
    "aria-controls": "nav-screen",
    onClick: () => emit("toggle"),
}, h("span", { class: "button-container" }, [
    h("span", { class: "button-top" }),
    h("span", { class: "button-middle" }),
    h("span", { class: "button-bottom" }),
]));
ToggleNavbarButton.displayName = "ToggleNavbarButton";
export default ToggleNavbarButton;
//# sourceMappingURL=ToggleNavbarButton.js.map