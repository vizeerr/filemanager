import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBQpv-U7zjVgPTbfK7RMHg05eWkICPg4aA",
    authDomain: "monkhood-55245.firebaseapp.com",
    databaseURL: "https://monkhood-55245-default-rtdb.firebaseio.com",
    projectId: "monkhood-55245",
    storageBucket: "monkhood-55245.appspot.com",
    messagingSenderId: "567445925428",
    appId: "1:567445925428:web:afde7efc78f65b381ca461"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  console.log('Initializing new Firebase app');
  app = initializeApp(firebaseConfig);
} else {
  console.log('Reusing existing Firebase app');
  app = getApps()[0];
}

console.log('Firebase app initialized:', app.name);

const storage = getStorage(app);
const db = getFirestore(app);

console.log('Firestore initialized:', db.app.name);
console.log('Storage initialized:', storage.app.name);

export { storage, db };

