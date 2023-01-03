import type { PropType } from 'vue';
import type { ExternalLinkIconLocales } from '../../shared/index.js';
import '../styles/vars.css';
import '../styles/external-link-icon.css';
export declare const ExternalLinkIcon: import("vue").DefineComponent<{
    locales: {
        type: PropType<ExternalLinkIconLocales>;
        required: false;
        default: () => {};
    };
}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    locales: {
        type: PropType<ExternalLinkIconLocales>;
        required: false;
        default: () => {};
    };
}>>, {
    locales: ExternalLinkIconLocales;
}>;
