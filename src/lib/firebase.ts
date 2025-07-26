import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCc233TnkKRbgC8fNNBTup21OzyvjVji6c",
  authDomain: "be-chat-data-dashboard.firebaseapp.com",
  projectId: "be-chat-data-dashboard",
  storageBucket: "be-chat-data-dashboard.firebasestorage.app",
  messagingSenderId: "1002828430896",
  appId: "1:1002828430896:web:3e4145f7456c2b3a7af7f5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;