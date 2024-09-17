<script setup lang="ts">
import Landing from './components/Landing.vue'
import { useItemStore } from './stores/item'
import { useConnectionStore } from '@/stores/connection'

const itemStore = useItemStore()
const connectionStore = useConnectionStore()

itemStore.bindEvents()
connectionStore.bindEvents()
</script>

<template>
  <Landing />
</template>

<style scoped></style>
