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
     * Playground file data
     *
     * 演示文件数据
     */
    files: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Playground settings
     *
     * 演示设置
     */
    settings: {
        type: StringConstructor;
        default: string;
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
     * Playground file data
     *
     * 演示文件数据
     */
    files: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Playground settings
     *
     * 演示设置
     */
    settings: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    title: string;
    settings: string;
}>;

export { _default as default };
