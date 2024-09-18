<script setup lang="ts">
import { socket } from '@/socket'
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'

const userStore = useUsersStore()
const inputValue = ref('')

const onSubmit = () => {
  socket.emit('messageToRoom', { message: inputValue.value, room: userStore.currentRoom })
  inputValue.value = ''
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <p>Current room: {{ userStore.currentRoom }}</p>
    <input v-model="inputValue" type="text" placeholder="Enter your message" />
    <button type="submit">Submit</button>
  </form>
</template>
