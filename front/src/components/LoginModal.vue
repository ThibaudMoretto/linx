<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const emit = defineEmits(['login'])

const username = ref('')

const handleLogin = () => {
  if (username.value.trim()) {
    emit('login', username.value.trim())
  }
}
</script>

<template>
  <Dialog
    header="Enter your username"
    :visible="true"
    :closable="false"
    :modal="true"
    :style="{ width: '300px' }"
  >
    <div class="p-fluid">
      <InputText v-model="username" placeholder="Username" @keyup.enter="handleLogin" />
    </div>
    <template #footer>
      <Button label="Join" @click="handleLogin" :disabled="!username.trim()" />
    </template>
  </Dialog>
</template>
