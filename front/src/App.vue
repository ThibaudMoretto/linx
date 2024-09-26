<script setup lang="ts">
import { ref, provide } from 'vue'
import { socket } from './socket'
import { useUsersStore } from './stores/users'
import Landing from './components/Landing.vue'
import LoginModal from './components/LoginModal.vue'

const userStore = useUsersStore()

const isLoggedIn = ref(false)

const handleLogin = (username: string) => {
  userStore.setUsername(username)
  userStore.setClientId(socket.id || '')
  isLoggedIn.value = true
  socket.emit('setUsername', username)
}

provide('socket', socket)
</script>

<template>
  <div class="app-container">
    <LoginModal v-if="!isLoggedIn" @login="handleLogin" />
    <template v-else>
      <div class="app-content">
        <Landing />
      </div>
    </template>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.app-content {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
