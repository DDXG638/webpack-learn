<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<style>
@import './styles/global.css';

.main-content {
  min-height: calc(100vh - 80px);
}
</style>
