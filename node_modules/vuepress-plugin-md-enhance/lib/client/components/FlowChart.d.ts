import * as vue from 'vue';
import { PropType, VNode } from 'vue';

declare const _default: vue.DefineComponent<{
    /**
     * Flowchart code content
     *
     * 流程图代码内容
     */
    code: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Flowchart id
     *
     * 流程图 id
     */
    id: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Flowchart preset
     *
     * 流程图预设
     */
    preset: {
        type: PropType<"ant" | "pie" | "vue">;
        default: string;
    };
}, () => (VNode | null)[], unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    /**
     * Flowchart code content
     *
     * 流程图代码内容
     */
    code: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Flowchart id
     *
     * 流程图 id
     */
    id: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Flowchart preset
     *
     * 流程图预设
     */
    preset: {
        type: PropType<"ant" | "pie" | "vue">;
        default: string;
    };
}>>, {
    preset: "ant" | "pie" | "vue";
}>;

export { _default as default };
