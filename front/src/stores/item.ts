import { defineStore } from 'pinia'
import { socket } from '@/socket'

export const useItemStore = defineStore('item', {
  state: () => ({
    items: [] as { id: number; label: string }[]
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
        this.items.push(data.clientId)
      })
    },

    createItem(label: string) {
      const item = {
        id: Date.now(), // temporary ID for v-for key
        label
      }
      this.items.push(item)

      socket.emit('item:create', { label }, (res: any) => {
        item.id = res.data
      })
    }
  }
})
