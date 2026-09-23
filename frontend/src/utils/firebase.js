import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlHsvo7Z4jNYZLUSz6renRcl8yqq2QAiw",
  authDomain: "samanvayai.firebaseapp.com",
  projectId: "samanvayai",
  storageBucket: "samanvayai.firebasestorage.app",
  messagingSenderId: "991858619914",
  appId: "1:991858619914:web:5fb001367741e3008351f3",
  measurementId: "G-GCFKVZ64MT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();