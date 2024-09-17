import { defineStore } from 'pinia'

export const useUsersStore = defineStore('user', {
  state: () => ({
    currentRoom: '',
    totalUsers: 0
  }),
  getters: {
    getRoom(): string {
      return this.currentRoom
    }
  },
  actions: {
    setCurrentRoom(room: string) {
      this.currentRoom = room
    }
  }
})
