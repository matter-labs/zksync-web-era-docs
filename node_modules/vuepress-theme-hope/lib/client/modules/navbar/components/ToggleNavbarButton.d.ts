import type { FunctionalComponent } from "vue";
import "../styles/toggle-navbar-button.scss";
export interface ToggleNavbarButtonProps {
    active?: boolean;
}
declare const ToggleNavbarButton: FunctionalComponent<ToggleNavbarButtonProps, {
    toggle: () => void;
}>;
export default ToggleNavbarButton;
