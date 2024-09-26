<script setup lang="ts">
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import ConnectionState from './ConnectionState.vue'
import MyForm from './MyForm.vue'
import Messages from './Messages.vue'
import Lobby from './Lobby.vue'
import { socket } from '@/socket'
import { onMounted, ref } from 'vue'

const usersStore = useUsersStore()
const { currentRoom } = storeToRefs(usersStore)

const isLobbyOpen = ref(false)

socket.on('numberOfUsers', (numberOfUsers: number) => {
  usersStore.setTotalUsers(numberOfUsers)
})

onMounted(() => {
  socket.emit('getNumberOfUsers')
})

const handleLobby = () => {
  // open the lobby
  isLobbyOpen.value = !isLobbyOpen.value
}
</script>

<template>
  <div class="landing-container">
    <header class="header">
      <h1>Welcome to Linx!</h1>
      <ConnectionState />
    </header>

    <main class="main-content">
      <Button label="Lobby" @click="handleLobby">Open lobby</Button>
      <p v-if="currentRoom">Current room: {{ currentRoom }}</p>
      <div class="lobby-section">
        <Lobby :isLobbyOpen="isLobbyOpen" @update:isLobbyOpen="handleLobby" />
      </div>

      <div class="chat-section" v-if="currentRoom">
        <Messages />
        <MyForm />
      </div>
    </main>
  </div>
</template>

<style scoped>
.landing-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat-section {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  flex: 1;
}

.header {
  text-align: center;
}

h1 {
  color: #2d3748;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 30px;
  flex: 1;

  button {
    width: fit-content;
    align-self: center;
    white-space: nowrap;
    padding: 10px 20px;
    border-radius: 10px;
    border: none;

    &:hover {
      cursor: pointer;
    }
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .lobby-section,
  .chat-section {
    width: 100%;
  }
}
</style>
