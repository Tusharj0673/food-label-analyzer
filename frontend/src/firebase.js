import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCPo4zcbdhrxPpSSG3Hp_K8cOooqcWnX-s",
  authDomain: "labeliq-86edc.firebaseapp.com",
  projectId: "labeliq-86edc",
  storageBucket: "labeliq-86edc.firebasestorage.app",
  messagingSenderId: "428845856441",
  appId: "1:428845856441:web:78c444eef0affdc11a8d68"
};

const app      = initializeApp(firebaseConfig)
const auth     = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider, signInWithPopup }