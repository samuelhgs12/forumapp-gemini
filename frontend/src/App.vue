<script setup lang="ts">
// This is the main layout component.
// It simply renders the component for the current route.
</script>

<template>
  <div id="main-layout">
    <header>
      <h1>ForumApp</h1>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#main-layout {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}
</style>
