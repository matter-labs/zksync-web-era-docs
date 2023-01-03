import * as vue from 'vue';
import { PropType, VNode } from 'vue';

type ThemeType = "auto" | "black" | "white" | "league" | "beige" | "sky" | "night" | "serif" | "simple" | "solarized" | "blood" | "moon";

declare const _default: vue.DefineComponent<{
    /**
     * Presentation id
     *
     * 幻灯片 id
     */
    id: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Presentation code
     *
     * 幻灯片代码
     */
    code: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Presentation theme
     *
     * 幻灯片主题
     */
    theme: {
        type: PropType<ThemeType>;
        default: string;
    };
}, () => VNode, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    /**
     * Presentation id
     *
     * 幻灯片 id
     */
    id: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Presentation code
     *
     * 幻灯片代码
     */
    code: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Presentation theme
     *
     * 幻灯片主题
     */
    theme: {
        type: PropType<ThemeType>;
        default: string;
    };
}>>, {
    theme: ThemeType;
}>;

export { _default as default };
