const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const admin = require('firebase-admin');
const { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } = require('firebase/firestore'); // Add missing imports
const path = require('path'); 
const userRoutes = require('./routes/studentsroutes');
const {decidewheretogo,getAllParentsCredentials,getAllStudentsCredential,getAllAttendanceRecords, getAllAcademicRecords, getStudentByParentPhone ,getAttendanceByStudentId,acadamics} = require('./controllers');
const axios = require('axios');
const app = express();





app.use(cors());
app.use(bodyParser.json());

// Set up multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Resume file upload code



app.post('/api/query/', decidewheretogo);
app.post('/api/get/', getAllParentsCredentials);
app.post('/api/getstudent/', getAllStudentsCredential);
app.post('/api/Attendance/', getAllAttendanceRecords);
app.post('/api/Acadamics/', getAllAcademicRecords);
app.post('/api/Checkingstudents/',  getStudentByParentPhone);
app.post('/api/CheckAttandance/', getAttendanceByStudentId);





const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

