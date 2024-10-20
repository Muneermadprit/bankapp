'use strict';

const db = require('./db');
const { collection, addDoc, getDocs,query, where, writeBatch,doc, getDoc   } = require('firebase/firestore');
const Students = require('./models/studentscredentials');
const Acadamics = require('./models/acadamics');
const Parentscredentials = require('./models/parentscredentials');
const Query = require('./models/querys');



// Add Career
const addCareers = async (req, res) => {
    try {
        const data = req.body;
        const docRef = await addDoc(collection(db, 'careers'), data);
        res.send('Career added successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};


const getAcadamics = async (req, res) => {
    try {
        // Extract document ID from the request parameters
        const docId = req.params.id;
        console.log('Document ID:', docId);

        if (!docId) {
            return res.status(400).send('Document ID is required');
        }

        // Reference to the midterm2024 subcollection under the specified docId
        const midtermCollectionRef = collection(db, 'acadamic', docId, 'midterm2024');
        const midtermSnapshot = await getDocs(midtermCollectionRef);

        if (midtermSnapshot.empty) {
            return res.status(404).send('No records found in midterm2024');
        }

        // Extract data from each document in the subcollection
        const midtermData = midtermSnapshot.docs.map(doc => ({
            id: doc.id, // Document ID
            socialscience: doc.data().socialscience,
            mathematics: doc.data().mathematics,
            english: doc.data().english,
            IT: doc.data().IT
        }));

        // Send the academic data in the response
        return res.status(200).send(midtermData);
    } catch (error) {
        console.error('Error fetching academic record:', error); // Log the error for debugging
        return res.status(500).send(error.message);
    }
};

//annual term results

const getAcadamicsannual = async (req, res) => {
    try {
        // Extract document ID from the request parameters
        const docId = req.params.id;
        console.log('Document ID:', docId);

        if (!docId) {
            return res.status(400).send('Document ID is required');
        }

        // Reference to the midterm2024 subcollection under the specified docId
        const midtermCollectionRef = collection(db, 'acadamic', docId, 'anualterm2024');
        const midtermSnapshot = await getDocs(midtermCollectionRef);

        if (midtermSnapshot.empty) {
            return res.status(404).send('No records found in anualterm2024');
        }

        // Extract data from each document in the subcollection
        const midtermData = midtermSnapshot.docs.map(doc => ({
            id: doc.id, // Document ID
            socialscience: doc.data().socialscience,
            mathematics: doc.data().mathematics,
            english: doc.data().english,
            IT: doc.data().IT
        }));

        // Send the academic data in the response
        return res.status(200).send(midtermData);
    } catch (error) {
        console.error('Error fetching academic record:', error); // Log the error for debugging
        return res.status(500).send(error.message);
    }
};







// Add Contact
const addContacts = async (req, res) => {
    try {
        const data = req.body;
        const docRef = await addDoc(collection(db, 'contacts'), data);
        res.send('Contact added successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Function to get parent credentials and check them
const getParentcredentials = async (req, res) => {
    try {
        const { id, password } = req.body; // Extract id and password from request body

        if (!id || !password) {
            return res.status(400).send('ID and password are required');
        }

        const contactsCollection = collection(db, 'parentscredentials');
        const contactSnapshot = await getDocs(contactsCollection);

        if (contactSnapshot.empty) {
            return res.status(404).send('No contacts found');
        }

        let isValid = false;

        // Loop through the collection and check for matching credentials
        contactSnapshot.forEach(doc => {
            const contact = doc.data();
            if (contact.email === id && contact.password === password) {
                isValid = true;
            }
        });

        if (isValid) {
            return res.status(200).send('OK'); // Credentials match
        } else {
            return res.status(401).send('Not OK'); // Credentials don't match
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
};
// Add Subscriber
const addSubscribers = async (req, res) => {
    try {
        const data = req.body;
        const docRef = await addDoc(collection(db, 'subscribers'), data);
        res.send('Subscriber added successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Get Subscribers
const getToppers = async (req, res) => {
    try {
        const subscribersCollection = collection(db, 'topperslist'); // Reference to the 'topperslist' collection
        const subscribersSnapshot = await getDocs(subscribersCollection); // Get all documents from the collection
        const subscribersArray = [];

        if (subscribersSnapshot.empty) {
            return res.status(404).send('No subscribers found');
        } else {
            // Loop through each document in the snapshot and push only the document ID
            subscribersSnapshot.forEach(doc => {
                subscribersArray.push(doc.id); // Push the document ID into the array
            });
            return res.status(200).send(subscribersArray); // Return the array of document IDs
        }
    } catch (error) {
        return res.status(400).send(error.message); // Return error message on failure
    }
};


//geteach toppers
const getToppersById = async (req, res) => {
    try {
        // Extract document ID from the request parameters
        const docId = req.params.id;
        console.log('Document ID:', docId);

        if (!docId) {
            return res.status(400).send('Document ID is required');
        }

        // Reference to the specific document in the 'topperslist' collection
        const docRef = doc(db, 'topperslist', docId);
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
            return res.status(404).send('No topper found with the given ID');
        }

        // Send the document data in the response
        return res.status(200).send({
            id: docSnapshot.id, // Document ID
            ...docSnapshot.data() // Document data
        });
    } catch (error) {
        console.error('Error fetching topper:', error); // Log the error for debugging
        return res.status(500).send(error.message);
    }
};



// Add Subscriber
const addBrouchure = async (req, res) => {
    try {
        const data = req.body;
        const docRef = await addDoc(collection(db, 'Brouchure'), data);
        res.send('contact added successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Get Subscribers
const getBrouchure = async (req, res) => {
    try {
        const subscribersCollection = collection(db, 'Brouchure');
        const subscribersSnapshot = await getDocs(subscribersCollection);
        const subscribersArray = [];

        if (subscribersSnapshot.empty) {
            res.status(404).send('No Brouchure downloaded found');
        } else {
            subscribersSnapshot.forEach(doc => {
                const subscriber = doc.data();
                const subscriberData = new Acadamics(
                    subscriber.name,
                    subscriber.email,
                    subscriber.phonenumber




                );
                subscribersArray.push(subscriberData);
            });
            res.status(200).send(subscribersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};










// Add Query
const addquery = async (req, res) => {
    try {
        const data = req.body;
        const docRef = await addDoc(collection(db, 'querys'), data);
        res.send('Query added successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Get Queries
const getquery = async (req, res) => {
    try {
        const queryCollection = collection(db, 'querys');
        const querySnapshot = await getDocs(queryCollection);
        const queryArray = [];

        if (querySnapshot.empty) {
            res.status(404).send('No queries found');
        } else {
            querySnapshot.forEach(doc => {
                const query = doc.data();
                const queryData = new Query(
                    query.name,
                    query.phonenumber,
                    query.messages
                );
                queryArray.push(queryData);
            });
            res.status(200).send(queryArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};


const updateAdmin = async (req, res) => {
    try {
        const { adminId, newPassword } = req.body;

        if (!adminId || !newPassword) {
            return res.status(400).send('Admin ID and new password are required.');
        }

        // Create a query to find the document where the `adminId` field matches
        const adminQuery = query(collection(db, 'admin'), where('adminid', '==', adminId));
        const querySnapshot = await getDocs(adminQuery);

        if (querySnapshot.empty) {
            return res.status(404).send('Admin not found.');
        }

        // Create a write batch
        const batch = writeBatch(db);

        // Update the password for the matching document(s)
        querySnapshot.forEach(doc => {
            const adminRef = doc.ref;
            batch.update(adminRef, { password: newPassword });
        });

        // Commit the batch
        await batch.commit();

        res.send('Admin updated successfully.');
    } catch (error) {
        res.status(400).send(`Error updating admin: ${error.message}`);
    }
};

const getAdmin = async (req, res) => {
    try {
        // Create a reference to the admin collection
        const adminCollection = collection(db, 'admin');
        
        // Get all documents from the collection
        const adminSnapshot = await getDocs(adminCollection);

        if (adminSnapshot.empty) {
            return res.status(404).send('No admins found.');
        }

        // Extract data from the documents
        const adminsArray = [];
        adminSnapshot.forEach(doc => {
            adminsArray.push(doc.data());
        });

        res.status(200).send(adminsArray);
    } catch (error) {
        res.status(400).send(`Error fetching admins: ${error.message}`);
    }
};



module.exports = {
    addCareers,
    getAcadamics,
    getAcadamicsannual,
    getParentcredentials,
    addSubscribers,
    getToppers,
    getToppersById,
    addquery,
    getquery,
    updateAdmin,
    getAdmin,
    addBrouchure,
    getBrouchure
};

