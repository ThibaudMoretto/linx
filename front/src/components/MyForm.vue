<script setup lang="ts">
import { socket } from '@/socket'
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const userStore = useUsersStore()
const { currentRoom } = storeToRefs(userStore)
const inputValue = ref('')

const onSubmit = () => {
  socket.emit('messageToRoom', {
    message: inputValue.value,
    room: currentRoom.value,
    author: userStore.username
  })
  inputValue.value = ''
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <InputText
      v-model="inputValue"
      type="text"
      placeholder="Type your message..."
      :disabled="!currentRoom"
    />
    <Button :disabled="!currentRoom" type="submit">Send</Button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 10px;
}

input {
  flex-grow: 1;
}
</style>
