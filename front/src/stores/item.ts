import { defineStore } from 'pinia'
import { socket } from '@/socket'

enum ItemType {
  USER_JOINED = 'userJoined',
  MESSAGE = 'message'
}

export const useItemStore = defineStore('item', {
  state: () => ({
    items: [] as {
      id: number
      label: string
      author: string
      timestamp: number
      type: ItemType
    }[]
  }),

  actions: {
    bindEvents() {
      // sync the list of items of the specific room when joining the room
      socket.on('item:sync', (items) => {
        this.items = items
      })

      // update the store when an item was created
      socket.on('item:created', (item) => {
        this.items.push(item)
      })

      socket.on('userJoined', (data) => {
        this.items.push({
          id: Date.now(),
          label: `${data.clientId} has joined the room`,
          author: data.clientId,
          timestamp: Date.now(),
          type: ItemType.USER_JOINED
        })
      })
    },

    createItem({ label, author }: { label: string; author: string }) {
      const item = {
        id: Date.now(),
        label,
        author,
        timestamp: Date.now(),
        type: ItemType.MESSAGE
      }
      this.items.push(item)
      console.log('Items after push:', this.items)
    },

    deleteAllItems() {
      this.items = []
    }
  }
})
