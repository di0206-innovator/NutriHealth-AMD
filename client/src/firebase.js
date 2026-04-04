import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, 
  addDoc, serverTimestamp, orderBy, limit, writeBatch, increment, Timestamp,
  getAggregateFromServer, sum, average, count
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "MOCK_KEY_FOR_UI_VERIFICATION",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nutrilens-mock.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nutrilens-704404815769",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nutrilens-mock.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:mock"
};

// Defensive Initialization
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Metabolic Ecosystem Sync Failed:", error);
  app = {}; 
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export { onAuthStateChanged };

const googleProvider = new GoogleAuthProvider();

// AUTH ACTIONS
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logoutUser = () => signOut(auth);

// USER PROFILE ACTIONS
export const saveUserProfile = async (uid, profileData) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { ...profileData, onboarded: true, updatedAt: serverTimestamp() }, { merge: true });
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

// Snippet 6: Firestore batch writes for atomic meal save + daily stat update
export const saveMealWithStats = async (uid, mealData) => {
  const batch = writeBatch(db);
  
  // Write the meal in subcollection (Snippet 1/5 style)
  const mealRef = doc(collection(db, 'users', uid, 'meals'));
  batch.set(mealRef, { ...mealData, timestamp: serverTimestamp() });
  
  // Update daily aggregate atomically
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const statsRef = doc(db, 'users', uid, 'stats', today);
  batch.set(statsRef, {
    total_meals: increment(1),
    total_calories: increment(mealData.calories || 0),
    score_sum: increment(mealData.health_score || 0),
    date: today
  }, { merge: true });
  
  await batch.commit(); // Atomic — both succeed or neither does
  return mealRef.id;
};

// Snippet 7: Cloud Firestore aggregate stats (Server-side aggregation)
export const getMealAggregates = async (uid) => {
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  
  const q = query(
    collection(db, 'users', uid, 'meals'),
    where('timestamp', '>=', Timestamp.fromDate(startOfDay))
  );
  
  try {
    const snapshot = await getAggregateFromServer(q, {
        totalMeals: count(),
        totalCalories: sum('calories'),
        avgScore: average('health_score')
    });
    
    const data = snapshot.data();
    return {
        meals: data.totalMeals,
        calories: Math.round(data.totalCalories || 0),
        avgScore: Math.round(data.avgScore || 0)
    };
  } catch (e) {
      console.error("Aggregation Failed:", e);
      return { meals: 0, calories: 0, avgScore: 0 };
  }
};

// Snippet 19: Retrieval of daily aggregates for streak intelligence
export const getDailyStats = async (uid, daysCount = 30) => {
  const stats = {};
  const statsRef = collection(db, 'users', uid, 'stats');
  const q = query(statsRef, orderBy('date', 'desc'), limit(daysCount));
  
  try {
    const snap = await getDocs(q);
    snap.forEach(doc => {
      stats[doc.id] = doc.data();
    });
    return stats;
  } catch (e) {
    console.error("Streak Bio-Analysis Interrupted:", e);
    return {};
  }
};

// Legacy support for top-level collection if needed (not recommended)
export const saveMeal = (uid, mealData) => saveMealWithStats(uid, mealData);
