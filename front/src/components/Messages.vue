<script lang="ts" setup>
import { socket } from '@/socket'
import { useItemStore } from '@/stores/item'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, computed } from 'vue'

const itemStore = useItemStore()
const userStore = useUsersStore()

const { items } = storeToRefs(itemStore)

onMounted(() => {
  socket.on('messageResponse', handleMessageResponse)
})

onUnmounted(() => {
  socket.off('messageResponse', handleMessageResponse)
})

const handleMessageResponse = (data: any) => {
  console.log('Received message:', data)
  itemStore.createItem({ label: data.label, author: data.author })
}

const isOwnMessage = computed(
  () => (messageUsername: string) => messageUsername === userStore.username
)
const isUserJoinedMessage = (item: any) => item.type === 'userJoined'
</script>

<template>
  <div class="messages-container">
    <div
      v-if="items.length"
      v-for="item in items"
      :key="item.id"
      :class="{
        'message-wrapper': !isUserJoinedMessage(item),
        'own-message': isOwnMessage(item.author),
        'info-message': isUserJoinedMessage(item)
      }"
    >
      <div v-if="isUserJoinedMessage(item)" class="info-bubble">
        {{ item.label }}
      </div>
      <div v-else class="message-bubble">
        <div class="message-username" v-if="!isOwnMessage(item.author)">
          {{ item.author }}
        </div>
        <div class="message-content">{{ item.label }}</div>
        <div class="message-timestamp">{{ new Date(item.timestamp).toLocaleTimeString() }}</div>
      </div>
    </div>
    <div v-else class="no-messages">No messages yet</div>
  </div>
</template>

<style scoped>
.messages-container {
  display: flex;
  flex-direction: column;
  background-color: #343434;
  padding: 15px;
  border-radius: 10px;
  flex: 1;
  width: 40vw;
  max-height: 60vh;
  overflow-y: auto;
  scrollbar-width: thin;
}

.message-wrapper {
  display: flex;
  margin-bottom: 10px;
}

.message-bubble {
  max-width: 90%;
  padding: 8px 12px;
  border-radius: 12px;
  background-color: #e5e5ea;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.own-message {
  justify-content: flex-end;
}

.own-message .message-bubble {
  background-color: #dcf8c6;
}

.message-username {
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 2px;
  color: black;
}

.message-content {
  word-wrap: break-word;
  color: black;
}

.message-timestamp {
  font-size: 0.7em;
  color: #888;
  text-align: right;
  margin-top: 2px;
}

.info-message {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  color: black;
}

.info-bubble {
  background-color: #e1ffc7;
  border-radius: 16px;
  padding: 5px 10px;
  font-size: 0.9em;
  color: #303030;
  text-align: center;
  max-width: 70%;
}
</style>
