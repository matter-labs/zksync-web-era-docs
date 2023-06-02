    <template>
        <NavBar>
        <template #rightStart>
            <GoogleTranslateSelect
            class="google-translate-select-language"
            default-language-code="en"
            default-page-language-code="en"
            :fetch-browser-language="false"
            @select="handleGoogleTranslateSelect"
            />
        </template>
        <template #centerStart>
            <div class="bar" :class="{ hide: !showBar }">
            <p class="text">Our Google translate plugin is fairly limited at the current time and may mistranslate some words.</p>
            </div>
        </template>
        </NavBar>
    </template>
    
    <script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import NavBar from "vuepress-theme-hope/modules/navbar/components/Navbar";
    import GoogleTranslateSelect from "@google-translate-select/vue3";
    
    const handleGoogleTranslateSelect = () => {};
    
    const showBar = ref(false);
    
    // Attach a click event listener to the document
    onMounted(() => {
        const handleDocumentClick = (event) => {
        const translateElement = document.querySelector(".google-translate-select-language");
        const barElement = document.querySelector(".bar");
    
        // Check if the clicked element is the translate element
        if (translateElement && translateElement.contains(event.target)) {
            showBar.value = true; // Show the bar element
        } else {
            showBar.value = false; // Hide the bar element
        }
        };
    
        document.addEventListener("click", handleDocumentClick);
    
        // Clean up the event listener when the component is unmounted
        onBeforeUnmount(() => {
        document.removeEventListener("click", handleDocumentClick);
        });
    });
    </script>
    
    <style scoped>
    .bar.hide {
        display: none;
    }
    
    p.text {
        color: #fff !important;
        padding: 0 0 0 30% !important;
        margin: 50px 0 0 0 !important;
        justify-content: center !important;
        font-size: 15px !important;
        font-weight: 500 !important;
    }
    </style>
    