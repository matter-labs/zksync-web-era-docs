<template>
  <div v-for="group in allTools.toolsByCategory" :key="group.category">
    <h2 :id="group.category">
      {{ group.category }}
    </h2>
    <div class="flex-container">
      <div class="flex-item" v-for="tool in group.tools" :key="tool.name">
        <img :src="$withBase(`/images/tools/${tool.logo}`)" class="devlogo" v-if="tool.logo" :alt="`${tool.name} logo`" />
        <h4 class="tool-name">
          {{ tool.name }}
        </h4>
        <p v-if="tool.description" class="tool-desc">{{ tool.description }}</p>
        <span v-if="tool.soon" class="tool-desc">(soon)</span>
        <a :href="tool.url" target="_blank" class="button">Visit website </a>
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
  justify-content: start;
}

.flex-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease-out;
  background: var(--info-bg-color);
  border-radius: 10px;
  font-weight: bold;
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
    width: calc(30% - 1rem);
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
.tool-name {
  margin-bottom: 0;
}
.tool-desc {
  font-weight: 200;
}

.button {
  padding: 10px 14px;
  margin-top: 10px;

  font-weight: 500;
  color: #fff;
  background-color: #1e69ff;
  border-radius: 10px;
}
</style>
