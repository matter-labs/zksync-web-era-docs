import * as vue from 'vue';
import { PropType, VNode } from 'vue';

interface TabProps extends Record<string, unknown> {
    title: string;
    value?: string;
}

declare const _default: vue.DefineComponent<{
    /**
     * Active tab index
     *
     * 激活的标签页序号
     */
    active: {
        type: NumberConstructor;
        default: number;
    };
    /**
     * Code tab data
     *
     * 代码标签页数据
     */
    data: {
        type: PropType<TabProps[]>;
        required: true;
    };
    /**
     * Code tab id
     *
     * 代码标签页 id
     */
    id: {
        type: StringConstructor;
        required: true;
    };
    /**
     * tab id
     *
     * 标签页 id
     */
    tabId: {
        type: StringConstructor;
        default: string;
    };
}, () => VNode | null, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    /**
     * Active tab index
     *
     * 激活的标签页序号
     */
    active: {
        type: NumberConstructor;
        default: number;
    };
    /**
     * Code tab data
     *
     * 代码标签页数据
     */
    data: {
        type: PropType<TabProps[]>;
        required: true;
    };
    /**
     * Code tab id
     *
     * 代码标签页 id
     */
    id: {
        type: StringConstructor;
        required: true;
    };
    /**
     * tab id
     *
     * 标签页 id
     */
    tabId: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    active: number;
    tabId: string;
}>;

export { _default as default };
