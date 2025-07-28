import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBDIdo7tWDcYqyyg0zgEJwQvw441k-_vDQ",
  authDomain: "table-to-csv-db9ee.firebaseapp.com",
  projectId: "table-to-csv-db9ee",
  storageBucket: "table-to-csv-db9ee.firebasestorage.app",
  messagingSenderId: "822759988820",
  appId: "1:822759988820:web:cc6f335a724ecbfb2a57c1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);