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
        const docId = req.params.id;h
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

// Get Contacts
const getContacts = async (req, res) => {
    try {
        const contactsCollection = collection(db, 'contacts');
        const contactSnapshot = await getDocs(contactsCollection);
        const contactArray = [];

        if (contactSnapshot.empty) {
            res.status(404).send('No contacts found');
        } else {
            contactSnapshot.forEach(doc => {
                const contact = doc.data();
                const contacts = new Contacts(
                    contact.fullname,
                    contact.email,
                    contact.street,
                    contact.city,
                    contact.postalcode,
                    contact.phonenumber,
                    contact.message
                );
                contactArray.push(contacts);
            });
            res.status(200).send(contactArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
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
const getSubscribers = async (req, res) => {
    try {
        const subscribersCollection = collection(db, 'subscribers');
        const subscribersSnapshot = await getDocs(subscribersCollection);
        const subscribersArray = [];

        if (subscribersSnapshot.empty) {
            res.status(404).send('No subscribers found');
        } else {
            subscribersSnapshot.forEach(doc => {
                const subscriber = doc.data();
                const subscriberData = new Acadamics(
                    subscriber.email
                );
                subscribersArray.push(subscriberData);
            });
            res.status(200).send(subscribersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
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
    addContacts,
    getContacts,
    addSubscribers,
    getSubscribers,
    addquery,
    getquery,
    updateAdmin,
    getAdmin,
    addBrouchure,
    getBrouchure
};

