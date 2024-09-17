<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { socket } from '@/socket'
import { useUsersStore } from '@/stores/users'
import { v4 } from 'uuid'

const rooms = ref<string[]>([])

const fetchRooms = () => {
  socket.emit('getRooms')
}

socket.on('roomsList', (data: string[]) => {
  rooms.value = data
})

onMounted(() => {
  fetchRooms()
})

const userStore = useUsersStore()
const handleJoinRoom = (room: string) => {
  socket.emit('joinRoom', room)
  userStore.setCurrentRoom(room)
}

const handleCreateRoom = () => {
  const room = v4()
  console.log('creating room', room)

  socket.emit('createRoom', room)
}
</script>

<template>
  <div>
    <h2>Lobby</h2>
    <div class="rooms">
      <button v-for="room in rooms" :key="room" @click="handleJoinRoom(room)">
        {{ room }}
      </button>
      <button @click="handleCreateRoom">Create room</button>
    </div>
  </div>
</template>

<style scoped>
.rooms {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
