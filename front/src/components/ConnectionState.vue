<template>
  <p>Connected: {{ connectionStore.isConnected }}</p>
</template>

<script lang="ts" setup>
import { useConnectionStore } from '@/stores/connection'

const connectionStore = useConnectionStore()
</script>
