import { localStorageService } from '@/composables/store'
import { ResponseError } from '@/models/error'
import router from '@/router'
import { authService } from '@/services/auth'
import { reactive } from 'vue'

class AuthViewModel {

  readonly model = reactive({
    email: '',
    password: '',
    loading: false,
    error: '',
    show: false,
  })

  readonly login = async () => {
    this.model.loading = true
    this.model.error = ''
    await authService.simulateDelay(500)
    try {
      const user = await authService.signIn(this.model.email, this.model.password)
      localStorageService.saveUser(user)
      router.go(0)
    } catch (error) {
      this.model.password = ''
      if (error instanceof ResponseError) {
        this.model.error = error.message
      }
    } finally {
      this.model.loading = false
    }
  }
}

export const authViewModel = new AuthViewModel();
