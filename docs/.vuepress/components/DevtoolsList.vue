<template>
  <div v-for="group in devtools" :key="group.category">
    <h3>{{ group.category }}</h3>
    <div class="flex-container">
      <a :href="tool.url" class="flex-item" v-for="tool in category.tools" :key="tool.name">
        <p>{{ tool.name }}</p>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const devtools = ref([
  {
    category: "frameworks",
    tools: [
      {
        name: "Hardhat",
        category: "Framework",
        description: "some desc",
        logo: "",
        url: "#",
      },
      {
        name: "Foundry",
        category: "Framework",
        description: "some desc",
        logo: "",
        url: "#",
      },
      {
        name: "Foundry",
        category: "Framework",
        description: "some desc",
        logo: "",
        url: "#",
      },
      {
        name: "Foundry",
        category: "Framework",
        description: "some desc",
        logo: "",
        url: "#",
      },
    ],
  },
  {
    category: "tooling",
    tools: [
      {
        name: "Thirdweb",
        category: "Dev tools",
        description: "some desc",
        logo: "",
        url: "#",
      },
      {
        name: "Foundry",
        category: "Framework",
        description: "some desc",
        logo: "",
        url: "#",
      },
      {
        name: "Atlas ZK",
        category: "Dev tools",
        description: "some desc",
        logo: "",
        url: "#",
      },
    ],
  },
  {
    category: "oracles",
    tools: [
      {
        name: "API3",
        category: "Oracle",
        description: "some desc",
        logo: "",
        url: "#",
      },
      {
        name: "Redstone",
        category: "Oracle",
        description: "some desc",
        logo: "",
        url: "#",
      },
    ],
  },
]);
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
  justify-content: space-around;
}

.flex-item {
  /* background:  */
  border-radius: 8px;
  border: 1px solid #333;
  /* color: white; */
  font-weight: bold;
  /* font-size: 2rem; */
  text-align: center;
  padding: 0.5rem;
  margin: 0.5rem;
  flex: 1 1 auto;
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
</style>
