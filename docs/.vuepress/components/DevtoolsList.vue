<template>
  <div v-for="group in allTools.toolsByCategory" :key="group.category">
    <h2>{{ group.category }}</h2>
    <div class="flex-container">
      <div class="flex-item" v-for="tool in group.tools" :key="tool.name">
        <img :src="`/images/tools/${tool.logo}`" class="devlogo" v-if="tool.logo" :alt="`${tool.name} logo`" />
        <p>{{ tool.name }}</p>
        <a :href="tool.url" target="_blank" class="button">Visit website</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import allTools from "../../assets/data/devtools.json";
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.flex-container {
  padding: 0.5rem;
  margin: 2rem auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* justify-content: space-around; */
}

.flex-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease-out;
  background: var(--info-bg-color);
  border-radius: 10px;
  /* border: 1px solid #333; */
  font-weight: bold;
  /* font-size: 2rem; */
  text-align: center;
  padding: 0.5rem;
  margin: 0.5rem;
  /* flex: 1 1 auto; */
  flex: 1 1 1;
  @media screen and (min-width: 320px) {
    width: 100%;
  }
  @media screen and (min-width: 640px) {
    width: calc(50% - 1rem);
  }
  @media screen and (min-width: 1100px) {
    width: calc(25% - 1rem);
  }
}
.flex-item:hover {
  font-style: none !important;
  -webkit-box-shadow: 4px 10px 24px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 4px 10px 24px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 4px 10px 24px -10px rgba(0, 0, 0, 0.75);
}

.devlogo {
  margin: 0.5rem auto;
  width: 60%;
  pointer-events: none !important;
  cursor: default !important;
}

.button {
  padding: 10px 14px;
  font-weight: 500;
  color: #fff;
  background-color: #1e69ff;
  border-radius: 10px;
}
</style>
