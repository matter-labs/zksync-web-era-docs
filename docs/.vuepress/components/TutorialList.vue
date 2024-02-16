<template>
  <div class="tutorial-container">
    <div v-for="(t, index) in tutorials" :key="t.title" class="tutorial-card">
      <h3 class="tutorial-title">
        <a :href="`${tutorialsRepo}${t.slug}/TUTORIAL.md`" target="_blank">{{ t.title }}</a>
        <span> by {{ t.author }}</span>
      </h3>
      <div :class="`badge`" v-for="tag in t.tags" :key="tag" :style="{ backgroundColor: getColorForBadge(tag) }">{{ tag }}</div>
      <p class="time"><span>⏳ Time:</span> <strong>{{ t.time }}</strong></p>
      <p>{{ t.description }}</p>
      <p>
        <a class="button" :href="`${tutorialsRepo}${t.slug}/TUTORIAL.md`" target="_blank">Tutorial repository</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const tutorialsRepo = "https://github.com/zkSync-Community-Hub/tutorials/blob/main/tutorials/";

const tutorials = ref([]);

onMounted(async () => {
  try {
    const response = await fetch("https://raw.githubusercontent.com/zkSync-Community-Hub/tutorials/main/tutorials.json");
    if (response.ok) {
      tutorials.value = await response.json();
    } else {
      console.error("Failed to fetch tutorials:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching tutorials:", error);
  }
});

const getColorForBadge = (badgeName) => {
  const hash = badgeName.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 70%)`;
};
</script>

<style>
.tutorial-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.tutorial-card {
  border: 1px solid #eaeaea;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.tutorial-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.tutorial-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.tutorial-title a {
  color: #1e69ff;
  text-decoration: none;
}

.tutorial-title a:hover {
  text-decoration: underline;
}

.author {
  font-size: 1rem;
  color: #888;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #fff;
  transition: background-color 0.3s;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  font-weight: 500;
  color: #fff;
  background-color: #1e69ff;
  border-radius: 20px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #0056b3;
}

.time {
  font-size: 1.1em;
  margin-top: 10px;
}

.time span {
  margin-right: 5px;
}
</style>
