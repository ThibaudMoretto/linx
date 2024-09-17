import { reactive } from 'vue'
import { io, Socket } from 'socket.io-client'

export const state = reactive({
  connected: false
})

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:3000'

const socket: Socket = io(URL)

const connectSocket = () => {
  socket.connect()
}

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
  }
}

export { connectSocket, disconnectSocket, socket }
