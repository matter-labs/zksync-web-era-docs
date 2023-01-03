import type { ComputedRef } from "vue";
export interface GlobalEncrypt {
    isGlobalEncrypted: ComputedRef<boolean>;
    validateGlobalToken: (token: string, keep?: boolean) => void;
}
export declare const useGlobalEncrypt: () => GlobalEncrypt;
