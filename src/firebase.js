import admin from 'firebase-admin';
import serviceAccount from './whatsapp-glimsol-firebase-adminsdk-wwg1n-6c37910437.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://whatsapp-glimsol-default-rtdb.asia-southeast1.firebasedatabase.app/',  // Realtime Database URL
});

const db = admin.database();  // Get a reference to the Realtime Database

export default db;