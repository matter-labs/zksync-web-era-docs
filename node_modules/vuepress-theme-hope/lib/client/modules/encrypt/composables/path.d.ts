import type { ComputedRef } from "vue";
export interface PathEncrypt {
    isEncrypted: ComputedRef<boolean>;
    getPathEncryptStatus: (path: string) => boolean;
    validateToken: (token: string, keep?: boolean) => void;
}
export declare const usePathEncrypt: () => PathEncrypt;
