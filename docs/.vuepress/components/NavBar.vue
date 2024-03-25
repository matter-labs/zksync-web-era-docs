    <template>
        <NavBar>
            <template #rightStart>
                <GoogleTranslateSelect default-language-code="en" default-page-language-code="en" :fetch-browser-language="false" trigger="click" @select="handleGoogleTranslateSelect" />
            </template>
        </NavBar>
    </template>
    
    <script setup lang="ts">
    import NavBar from "vuepress-theme-hope/modules/navbar/components/Navbar";
    import GoogleTranslateSelect from "@google-translate-select/vue3";
    
    const handleGoogleTranslateSelect = () => {};
    </script>
    