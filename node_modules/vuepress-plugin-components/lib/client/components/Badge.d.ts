import { FunctionalComponent } from 'vue';

interface BadgeProps {
    type?: string;
    text?: string;
    vertical?: "top" | "middle" | "baseline" | "bottom";
    color?: string;
}
declare const Badge: FunctionalComponent<BadgeProps>;

export { BadgeProps, Badge as default };
