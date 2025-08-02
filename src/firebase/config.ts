import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBOSxAfHJNMDgfF1k5WsfmksGHsrjRkrU",
  authDomain: "sistema-horario-lab-uefs.firebaseapp.com",
  projectId: "sistema-horario-lab-uefs",
  storageBucket: "sistema-horario-lab-uefs.firebasestorage.app",
  messagingSenderId: "1040433451506",
  appId: "1:1040433451506:web:99c33c11037dc9c54d9b6b",
  measurementId: "G-QFB93C0XH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Note: Firebase Storage is available on the free Spark plan with limitations:
// - 1GB total storage
// - 10GB/month transfer  
// - 50K operations/day
// These limits are sufficient for basic file storage without billing upgrade