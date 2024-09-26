import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    username: '',
    currentRoom: '',
    clientId: '',
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
    },
    setTotalUsers(totalUsers: number) {
      this.totalUsers = totalUsers
    },
    setUsername(username: string) {
      this.username = username
    },
    setClientId(id: string) {
      this.clientId = id
    }
  }
})
