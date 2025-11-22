import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from './environments/environment';

// Initialize Firebase with config from environment
export const app = initializeApp(environment.firebase);
export const db = getFirestore(app);
export const auth = getAuth(app);
