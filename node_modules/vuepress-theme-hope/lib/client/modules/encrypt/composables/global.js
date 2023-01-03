import { useStorage, useSessionStorage } from "@vueuse/core";
import { compareSync } from "bcrypt-ts/browser";
import { computed } from "vue";
import { useEncryptData } from "./utils.js";
const STORAGE_KEY = "VUEPRESS_HOPE_GLOBAL_TOKEN";
export const useGlobalEncrypt = () => {
    const encryptData = useEncryptData();
    const localToken = useStorage(STORAGE_KEY, "");
    const sessionToken = useSessionStorage(STORAGE_KEY, "");
    const isGlobalEncrypted = computed(() => {
        // is globally encrypted
        if (encryptData.value.global && encryptData.value.admin) {
            if (localToken.value)
                // none of the token matches
                return encryptData.value.admin.every((hash) => !compareSync(localToken.value, hash));
            if (sessionToken.value)
                // none of the token matches
                return encryptData.value.admin.every((hash) => !compareSync(sessionToken.value, hash));
            return true;
        }
        return false;
    });
    const validateGlobalToken = (inputToken, keep = false) => {
        (keep ? localToken : sessionToken).value = inputToken;
    };
    return {
        isGlobalEncrypted,
        validateGlobalToken,
    };
};
//# sourceMappingURL=global.js.map