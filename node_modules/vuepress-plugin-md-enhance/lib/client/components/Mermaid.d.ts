import * as vue from 'vue';
import { VNode } from 'vue';

declare const _default: vue.DefineComponent<{
    /**
     * Mermaid id
     */
    id: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Mermaid config
     *
     * Mermaid 配置
     */
    code: {
        type: StringConstructor;
        required: true;
    };
}, () => VNode, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    /**
     * Mermaid id
     */
    id: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Mermaid config
     *
     * Mermaid 配置
     */
    code: {
        type: StringConstructor;
        required: true;
    };
}>>, {}>;

export { _default as default };
