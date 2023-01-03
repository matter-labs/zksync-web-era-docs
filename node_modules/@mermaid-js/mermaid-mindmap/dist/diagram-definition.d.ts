import * as mindmapDb from './mindmapDb';
export declare const diagram: {
    db: typeof mindmapDb;
    renderer: {
        draw: (text: any, id: any, version: any, diagObj: any) => Promise<void>;
    };
    parser: any;
    styles: (options: any) => string;
    injectUtils: (_log: Record<import("./mermaidUtils").LogLevel, {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }>, _setLogLevel: any, _getConfig: any, _sanitizeText: any, _setupGraphViewbox: any) => void;
};
