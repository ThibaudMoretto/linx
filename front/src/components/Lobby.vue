<script setup lang="ts">
const { isLobbyOpen } = defineProps<{
  isLobbyOpen: boolean
}>()

import { ref, onMounted } from 'vue'
import { socket } from '@/socket'
import { useUsersStore } from '@/stores/users'
import { useItemStore } from '@/stores/item'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'

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
const emit = defineEmits(['update:isLobbyOpen'])
const itemStore = useItemStore()
const userStore = useUsersStore()
const handleJoinRoom = (room: string) => {
  socket.emit('joinRoom', room)
  userStore.setCurrentRoom(room)
  console.log('userStore.currentRoom', userStore.currentRoom)
  itemStore.deleteAllItems()
  emit('update:isLobbyOpen', false) // Close the drawer
}

const showModal = ref(false)
const newRoomName = ref('')

const handleCreateRoom = () => {
  showModal.value = true
}

const createRoom = () => {
  if (newRoomName.value.trim()) {
    socket.emit('createRoom', newRoomName.value.trim())
    showModal.value = false
    newRoomName.value = ''
  }
}
</script>
<template>
  <Drawer
    header="Lobby"
    class="lobby-container"
    :visible="isLobbyOpen"
    @update:visible="$emit('update:isLobbyOpen', $event)"
  >
    <div class="rooms-list">
      <button v-for="room in rooms" :key="room" @click="handleJoinRoom(room)" class="room-button">
        {{ room }}
      </button>
    </div>
    <Button @click="handleCreateRoom" label="Create room" class="p-button-primary" />

    <Dialog v-model:visible="showModal" modal header="Create a new room" :style="{ width: '50vw' }">
      <div class="p-fluid">
        <div class="p-field">
          <label for="roomName">Room Name</label>
          <InputText id="roomName" v-model="newRoomName" autofocus />
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="showModal = false"
          class="p-button-text"
        />
        <Button
          label="Create"
          icon="pi pi-check"
          @click="createRoom"
          :disabled="!newRoomName.trim()"
          autofocus
        />
      </template>
    </Dialog>
  </Drawer>
</template>

<style scoped>
.lobby-container {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.room-button {
  background-color: #e2e8f0;
  border: none;
  border-radius: 4px;
  color: #4a5568;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 10px;
  transition: background-color 0.2s ease;
}

.room-button:hover {
  background-color: #cbd5e0;
}
</style>
