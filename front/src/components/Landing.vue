<script setup lang="ts">
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import ConnectionManager from './ConnectionManager.vue'
import ConnectionState from './ConnectionState.vue'
import MyForm from './MyForm.vue'
import Messages from './Messages.vue'
import Lobby from './Lobby.vue'

const usersStore = useUsersStore()
const { totalUsers, currentRoom } = storeToRefs(usersStore)
</script>

<template>
  <h3>Welcome to Linx !</h3>

  <ConnectionManager />
  <ConnectionState />
  <Lobby />
  <!-- Displays the Messages only if currentRoom is not '' -->
  <div v-if="currentRoom">
    <Messages />
    <MyForm />
  </div>

  <h3>Users online: {{ totalUsers }}</h3>
</template>

<style scoped>
.greetings {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}
</style>
