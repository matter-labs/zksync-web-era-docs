import * as vue from 'vue';
import { FunctionalComponent, VNode } from 'vue';

interface CodeGroupItemProps {
    title: string;
    active?: boolean;
}
declare const CodeGroupItem: FunctionalComponent<CodeGroupItemProps>;
declare const CodeGroup: vue.DefineComponent<{}, () => VNode | null, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>>, {}>;

export { CodeGroup, CodeGroupItem, CodeGroupItemProps };
