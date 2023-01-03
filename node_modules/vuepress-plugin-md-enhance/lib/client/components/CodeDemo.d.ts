import * as vue from 'vue';
import { PropType, VNode } from 'vue';

declare const _default: vue.DefineComponent<{
    /**
     * Code demo id
     *
     * 代码演示 id
     */
    id: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Code demo type
     *
     * 代码演示类型
     */
    type: {
        type: PropType<"normal" | "vue" | "react">;
        default: string;
    };
    /**
     * Code demo title
     *
     * 代码演示标题
     */
    title: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Code demo config
     *
     * 代码演示配置
     */
    config: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Code demo code content
     *
     * 代码演示代码内容
     */
    code: {
        type: StringConstructor;
        required: true;
    };
}, () => VNode, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    /**
     * Code demo id
     *
     * 代码演示 id
     */
    id: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Code demo type
     *
     * 代码演示类型
     */
    type: {
        type: PropType<"normal" | "vue" | "react">;
        default: string;
    };
    /**
     * Code demo title
     *
     * 代码演示标题
     */
    title: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Code demo config
     *
     * 代码演示配置
     */
    config: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Code demo code content
     *
     * 代码演示代码内容
     */
    code: {
        type: StringConstructor;
        required: true;
    };
}>>, {
    type: "normal" | "vue" | "react";
    title: string;
    config: string;
}>;

export { _default as default };
