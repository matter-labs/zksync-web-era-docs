import * as vue from 'vue';
import { VNode } from 'vue';

declare const _default: vue.DefineComponent<{
    /**
     * Playground title
     *
     * 演示标题
     */
    title: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Playground link
     *
     * 演示链接
     */
    link: {
        type: StringConstructor;
        required: true;
    };
}, () => (VNode | null)[], unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    /**
     * Playground title
     *
     * 演示标题
     */
    title: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Playground link
     *
     * 演示链接
     */
    link: {
        type: StringConstructor;
        required: true;
    };
}>>, {
    title: string;
}>;

export { _default as default };
