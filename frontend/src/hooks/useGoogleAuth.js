import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '@/firebase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '@/api/axios'

export function useGoogleAuth() {
  const navigate = useNavigate()

  const signInWithGoogle = async () => {
    try {
      // Step 1 — Open Google popup
      const result = await signInWithPopup(
        auth,
        provider
      )

      // Step 2 — Get Firebase ID token
      const idToken = await result.user.getIdToken()

      // Step 3 — Send token to FastAPI
      const response = await api.post(
        '/auth/google',
        { id_token: idToken }
      )

      // Step 4 — Store JWT + user
      localStorage.setItem(
        'token',
        response.data.token
      )
      localStorage.setItem(
        'user',
        JSON.stringify({
          name:  response.data.name,
          email: response.data.email
        })
      )

      toast.success(
        `Welcome, ${response.data.name}!`
      )

      setTimeout(() => navigate('/scan'), 1000)

    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        return
      }
      toast.error('Google sign-in failed. Try again.')
      console.error(error)
    }
  }

  return { signInWithGoogle }
}