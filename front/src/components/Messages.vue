<script lang="ts" setup>
import { socket } from '@/socket'
import { useItemStore } from '@/stores/item'

const itemStore = useItemStore()
socket.on('messageResponse', (data: any) => {
  itemStore.createItem(data)
})
</script>

<template>
  <div>
    <h1>Messages</h1>
    <ul>
      <li v-for="message in itemStore.items" :key="message.id">
        {{ message.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  background-color: aquamarine;
  border-radius: 10px;
  padding: 10px;
  height: 200px;
  list-style: none;
}

li {
  color: black;
}
</style>
