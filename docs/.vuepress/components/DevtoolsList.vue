<template>
  <div v-for="group in allTools.toolsByCategory" :key="group.category">
    <h2 :id="group.category">
      {{ group.category }}
    </h2>
    <div class="grid-container">
      <div class="grid-item" v-for="tool in group.tools" :key="tool.name">
        <div class="logo-wrapper">
          <img :src="$withBase(`/images/tools/${tool.logo}`)" class="devlogo" v-if="tool.logo" :alt="`${tool.name} logo`" />
        </div>
        <div class="content-wraper">
          <h4 class="tool-name">
            {{ tool.name }}
          </h4>
          <p v-if="tool.description" class="tool-desc">{{ tool.description }}</p>
        </div>
        <span v-if="tool.soon" class="tool-desc">(soon)</span>
        <div class="btn-wrapper">
          <a :href="tool.url" target="_blank" class="button">Visit website </a>
        </div>
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
.grid-container {
  padding: 0.5rem;
  margin: 2rem auto;
  display: grid;
  grid-auto-rows: 1fr;

  @media screen and (min-width: 320px) {
    grid-template-columns: 1fr;
  }
  @media screen and (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (min-width: 1100px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

.grid-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease-out;
  background: var(--info-bg-color);
  border-radius: 10px;
  font-weight: bold;
  text-align: center;
  padding: 0.5rem;
  margin: 0.5rem;
}
.grid-item:hover {
  font-style: none !important;
  -webkit-box-shadow: 4px 10px 24px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 4px 10px 24px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 4px 10px 24px -10px rgba(0, 0, 0, 0.75);
}
.logo-wrapper {
  height: 100px;
  padding: 10px;
}
.devlogo {
  margin: 0.5rem auto;
  /* width: 100%; */
  height: 100%;
  pointer-events: none !important;
  cursor: default !important;
}
.content-wraper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.tool-name {
  margin-bottom: 0;
}
.tool-desc {
  font-weight: 200;
  margin-bottom: 5px;
}

.btn-wrapper {
  justify-content: flex-end;
  display: flex;
}

.button {
  width: 100%;
  padding: 10px 14px;
  margin-top: 10px;

  font-weight: 500;
  color: #fff;
  background-color: #1e69ff;
  border-radius: 8px;
}
</style>
