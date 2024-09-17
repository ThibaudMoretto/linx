<template>
  <button @click="connectSocket()">Connect</button>
  <button @click="disconnectSocket()">Disconnect</button>
</template>

<script lang="ts" setup>
import { connectSocket, disconnectSocket } from '@/socket'
</script>
