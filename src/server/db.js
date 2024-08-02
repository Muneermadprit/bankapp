const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const config = require('./config');

// Initialize Firebase
const app = initializeApp(config.firebaseConfig);
console.log('Firebase app name:', app.name);


// Get a Firestore instance
const db = getFirestore(app);

module.exports = db;



