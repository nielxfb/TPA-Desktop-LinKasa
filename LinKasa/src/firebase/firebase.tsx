import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBII5szb7Wfr1lFWem7w4jXiwTYsYecrHA',
  authDomain: 'linkasa-2b589.firebaseapp.com',
  projectId: 'linkasa-2b589',
  storageBucket: 'linkasa-2b589.appspot.com',
  messagingSenderId: '996397762801',
  appId: '1:996397762801:web:e3c952fd2c672929914150'
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

export { db, auth, storage };
