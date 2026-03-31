import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, collection, addDoc, 
  query, orderBy, limit, getDocs, where, Timestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app, auth, db;
let isDemoMode = false;

try {
  if (!firebaseConfig.apiKey) throw new Error("Missing Firebase API Key");
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization failed. Running in Demo Mode.', error.message);
  isDemoMode = true;
}

// In-Memory Storage for Demo Mode
const demoState = {
  profile: null,
  meals: []
};

// Auth helpers
export const signInAnon = async () => {
  if (isDemoMode) return { user: { uid: 'demo-user-123' } };
  return signInAnonymously(auth);
};

export const onAuth = (callback) => {
  if (isDemoMode) {
    setTimeout(() => callback({ uid: 'demo-user-123' }), 500); // Simulate network delay
    return () => {}; // Mock unsubscribe
  }
  return onAuthStateChanged(auth, callback);
};

// Profile helpers
export const saveUserProfile = async (uid, profile) => {
  if (isDemoMode) {
    demoState.profile = { ...profile, updatedAt: new Date() };
    return;
  }
  await setDoc(doc(db, 'users', uid, 'data', 'profile'), {
    ...profile,
    updatedAt: Timestamp.now()
  });
};

export const getUserProfile = async (uid) => {
  if (isDemoMode) {
    return demoState.profile;
  }
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'profile'));
  return snap.exists() ? snap.data() : null;
};

// Meal helpers
export const saveMeal = async (uid, mealData) => {
  if (isDemoMode) {
    const newMeal = { id: Date.now().toString(), ...mealData, timestamp: new Date() };
    demoState.meals.push(newMeal);
    return { id: newMeal.id };
  }
  const mealsRef = collection(db, 'users', uid, 'meals');
  return await addDoc(mealsRef, {
    ...mealData,
    timestamp: Timestamp.now()
  });
};

export const getRecentMeals = async (uid, limitCount = 10) => {
  if (isDemoMode) {
    return [...demoState.meals].reverse().slice(0, limitCount);
  }
  const q = query(
    collection(db, 'users', uid, 'meals'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getTodayMeals = async (uid) => {
  if (isDemoMode) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return demoState.meals.filter(m => m.timestamp >= startOfDay).reverse();
  }
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const q = query(
    collection(db, 'users', uid, 'meals'),
    where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
