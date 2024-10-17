const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const admin = require('firebase-admin');
const { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } = require('firebase/firestore'); // Add missing imports
const path = require('path'); 
const userRoutes = require('./routes/studentsroutes');
const { addContacts, getContacts, addCareers, getAcadamics, addSubscribers, getSubscribers, addquery, getquery,updateAdmin,getAdmin,addBrouchure,getBrouchure} = require('./controllers');

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
const db = getFirestore(); // Initialize Firestore
app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public', 'index.html'));

app.use(cors());
app.use(bodyParser.json());

// Set up multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Resume file upload code
app.post('/careers/upload-file', upload.single("file"), async (req, res) => {
  const { email } = req.body;

  if (!email || !req.file) {
    return res.status(400).send('Email and file are required');
  }

  try {
    // Get file extension
    const fileExtension = req.file.originalname.split('.').pop(); 
    
    // Create new file name using the email
    const newFileName = `${email}.${fileExtension}`; 
    
    // Reference to the new file in the 'resume' folder
    const storageRef = ref(storage, `resume/${newFileName}`); 
    
    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, req.file.buffer);

    // Get the download URL of the uploaded file
    const url = await getDownloadURL(storageRef);

    // Query the collection to find the document with the matching email field
    const careersRef = collection(db, 'careers');
    const q = query(careersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming there's only one document matching the email
      const docRef = querySnapshot.docs[0].ref;

      // Update the resume field with the URL
      await updateDoc(docRef, {
        resume: url,
      });

      res.send({ message: 'File uploaded and resume updated successfully', url });
    } else {
      res.status(404).send('Document not found.');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

// Routes for operations on Holistic Services
// Routes for managing Careers
app.post('/Careers', addCareers);
app.get('/Acadamics/:id', getAcadamics);


// Routes for managing Brouchure downloaded
app.post('/data', addBrouchure);
app.get('/data', getBrouchure);

// Routes for managing Contacts
app.post('/Contacts', addContacts);
app.get('/Contacts', getContacts);

// Routes for managing subscribers
app.post('/Subscribers', addSubscribers);
app.get('/Subscribers', getSubscribers);

// Routes for managing queries
app.post('/Queries', addquery);
app.get('/Queries',  getquery);

app.put('/admin',  updateAdmin);
app.get('/admin',  getAdmin);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

