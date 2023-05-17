<script lang="ts">
import ParentLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'
import GoogleTranslateSelect from '@google-translate-select/vue3'
//import CommonWrapper from "@theme-hope/components/CommonWrapper";

</script>

<template>
    <ParentLayout>
        <template>
            <div class="footer-col">
                    <GoogleTranslateSelect #navbarStartBefore default-language-code="en" default-page-language-code="en"
                        :fetch-browser-language="false" trigger="click" />
                </div>
        </template>
    </ParentLayout>
</template>
