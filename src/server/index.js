const express = require('express');
const cors = require('cors');
const path = require('path'); 
const bodyParser = require('body-parser');
const multer = require('multer');
const { getStorage, ref, uploadBytes, getDownloadURL, listAll } = require('firebase/storage');
const admin = require('firebase-admin');


const userRoutes = require('./routes/studentsroutes');
const {  addEmilist,  getEmis,  updateEmi, deleteEmi} = require('./controllers');

const app = express();


const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-firebase-project-id.appspot.com' // Replace with your actual Firebase storage bucket
});

const storage = getStorage();

app.use(cors());
app.use(bodyParser.json());





// Routes for managing students
app.post('/additem', addEmilist);
app.get('/getitem', getEmis);
app.put('/updateitem', updateEmi);
app.delete('/deleteitem', deleteEmi);




// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
