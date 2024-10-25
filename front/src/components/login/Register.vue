<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

const register = async () => {
  try {
    await axios.post('http://localhost:3000/auth/register', {
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    })
    router.push('/login')
  } catch (error) {
    console.error('Registration failed', error)
  }
}
</script>

<template>
  <div class="register-container">
    <div title="Register" class="register-card">
      <form @submit.prevent="register" class="p-fluid">
        <div class="p-field">
          <InputText id="username" v-model="username" placeholder="Username" required />
        </div>
        <div class="p-field">
          <Password id="password" v-model="password" placeholder="Password" required toggleMask />
        </div>
        <div class="p-field">
          <Password
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Confirm password"
            required
            toggleMask
          />
        </div>
        <Button label="Register" icon="pi pi-user-plus" type="submit" class="p-mt-2" />
      </form>
      <p class="login-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.register-card {
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

.login-link {
  text-align: center;
  margin-top: 1rem;
}
</style>
