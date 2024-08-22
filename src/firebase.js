import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://whatsapp-glimsol-2cd5f-default-rtdb.asia-southeast1.firebasedatabase.app/',  // Realtime Database URL
});

const db = admin.database();  // Get a reference to the Realtime Database

export default db;