<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const username = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      username: username.value,
      password: password.value
    })
    console.log(response)

    localStorage.setItem('token', response.data.access_token)
    router.push('/')
  } catch (error) {
    console.error('Login failed', error)
  }
}
</script>

<template>
  <div class="login-container">
    <div title="Login" class="login-card">
      <form @submit.prevent="login" class="p-fluid">
        <div class="p-field">
          <InputText id="username" v-model="username" placeholder="Username" required />
        </div>
        <div class="p-field">
          <Password id="password" v-model="password" placeholder="Password" required toggleMask />
        </div>
        <Button label="Login" icon="pi pi-sign-in" type="submit" class="p-mt-2" />
      </form>
      <p class="register-link">
        Don't have an account? <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.login-card {
  padding: 2rem;
  border-radius: 20px;
  background: #181818;
  box-shadow:
    5px 5px 10px #0e0e0e,
    -5px -5px 10px #222222;

  form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;

    .p-field {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
  }
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}
</style>
