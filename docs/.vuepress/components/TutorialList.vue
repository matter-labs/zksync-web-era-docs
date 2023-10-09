<template>
  <div>
    <div v-for="(t, index) in tutorials" :key="t.title" class="tutorial-card">
      <h3 class="tutorial-title">
        <a :href="`${tutorialsRepo}${t.slug}/TUTORIAL.md`" target="_blank">{{ t.title }}</a
        ><span> by {{ t.author }}</span>
      </h3>
      <div :class="`badge bg-${index}`" v-for="(tag, index) in t.tags" :key="tag"><span style="">⦿ </span>{{ tag }}</div>
      <p class="description"><strong>Difficulty:</strong> {{ t.level }}</p>
      <!-- <ul>
        <li :class="`badge bg-${index}`" v-for="(tag, index) in t.tags" :key="tag">{{ tag }}</li>
      </ul> -->

      <p>{{ t.description }}</p>

      <p>
        <a class="button" :href="`${tutorialsRepo}${t.slug}/TUTORIAL.md`" target="_blank">Tutorial repository</a>
      </p>
      <hr />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const tutorialsRepo = "https://github.com/zkSync-Community-Hub/tutorials/tree/main/tutorials/";

const tutorials = ref([
  {
    title: "Create awesome apps with Gelato",
    description:
      "Ut sed dui tristique, elementum enim eu, finibus odio. Mauris congue mi vel magna viverra, vel lacinia leo consequat. Morbi eleifend ex in orci ultricies, ut tincidunt leo posuere. ",
    tags: ["defi", "oracle", "uniswap"],
    level: "intermediate",
    author: "B.Blockchain",
    slug: "zksync-cli-quickstart",
  },
  {
    title: "Use Redstone to feed offchain data to smart contracts",
    description: "Ut sed dui tristique, elementum enim eu, finibus odio. Mauris congue mi vel magna viverra, vel lacinia leo consequat. Morbi eleifend ex in oleo posuere. ",
    tags: ["oracle", "redstone"],
    level: "beginner",
    author: "A.Developer",
    slug: "create-liquidity-pool-uniswap",
  },
  {
    title: "Sed pulvinar libero justo",
    description: "Vivamus egestas fringilla risus ac condimentum. In maximus massa ut bibendum faucibus. Duis condimentum ex diam, vitae vestibulum ligula convallis quis. ",
    tags: ["defi", "oracle", "uniswap", "thirdweb", "something soe", "somethings"],
    level: "beginner",
    author: "A.Developer",
    slug: "create-liquidity-pool-uniswap",
  },
]);
</script>

<style>
.title {
  /* margin: 0 0 0.1rem; */
  padding: 0;
  color: #2c3e50 !important;
}
.tutorial-card {
  border-bottom: 1px solid #1e69ff;
  padding-bottom: 10px;
  margin-bottom: 15px;
}
.description {
  margin: 0;
  padding: 0;
}
.button {
  padding: 10px 14px;
  font-weight: 500;
  color: #fff;
  background-color: #1e69ff;
  border-radius: 10px;
}
.badge {
  padding: 4px 8px;
  text-align: center;
  border-radius: 8px;
  margin: 0px 0px 4px 4px;
}
.bg-0 {
  border: 1px solid purple;
  background-color: #fff;
  color: purple;
  box-shadow: #2c3e50;
}
.bg-1 {
  background-color: #fff;
  border: 1px solid blue;
  color: blue;
}
.bg-2 {
  border: 1px solid deeppink;
  background-color: #fff;

  color: deeppink;
}
.bg-3 {
  border: 1px solid limegreen;
  background-color: #fff;

  color: yellowgreen;
}
.bg-4 {
  border: 1px solid darkorange;
  background-color: #fff;

  color: darkorange;
}
.bg-5 {
  border: 1px solid crimson;
  background-color: #fff;

  color: crimson;
}
</style>
