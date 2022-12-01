<!-- 
Add comment here
Adds a element to any page and displays "Table of Contents" above 
the VuePress generated TOC. It aligns itself above the TOC 
using css in index.styl, look for the .toc-label class.
-->

<template>
    <div class="toc-label">Table of Contents</div>
</template>
    
<script>
export default {
name: 'header',
};
</script>

<style scoped></style>