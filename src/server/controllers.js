'use strict';

const db = require('./db');
const { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } = require('firebase/firestore');
const Emicalculator = require('./models/Emicalculator-list');

// Add new EMI
const addEmilist = async (req, res, next) => {
    try {
        const data = req.body;
        const docRef = await addDoc(collection(db, 'emicalculator'), data);
        res.send('Data added successfully');
    } catch (error) {
        res.status(400).send(`Error adding data: ${error.message}`);
    }
};

// Get all EMIs
const getEmis = async (req, res, next) => {
    try {
        const emiCollection = collection(db, 'emicalculator');
        const emiSnapshot = await getDocs(emiCollection);
        const emiArray = [];

        if (emiSnapshot.empty) {
            res.status(404).send('No items found');
        } else {
            emiSnapshot.forEach(doc => {
                const emiData = doc.data();

                // Ensure emiData contains the necessary fields
                if (!emiData.loanamount || !emiData.monthlyemi || !emiData.rateofinterest || !emiData.years) {
                    console.error('Missing fields in EMI data', emiData); // Log error details
                    return; // Skip adding this entry
                }

                // Create an Emicalculator object
                const emi = new Emicalculator(
                    emiData.loanamount, 
                    emiData.monthlyemi,
                    emiData.rateofinterest,
                    emiData.years,
                );
                emiArray.push(emi);
            });
            res.status(200).send(emiArray);
        }
    } catch (error) {
        console.error('Error fetching EMIs:', error); // Log error details
        res.status(400).send(`Error fetching data: ${error.message}`);
    }
};

// Update EMI
const updateEmi = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const docRef = doc(db, 'emicalculator', id);
        await updateDoc(docRef, data);
        res.send('Data updated successfully');
    } catch (error) {
        res.status(400).send(`Error updating data: ${error.message}`);
    }
};

// Delete EMI
const deleteEmi = async (req, res, next) => {
    try {
        const id = req.params.id;
        const docRef = doc(db, 'emicalculator', id);
        await deleteDoc(docRef);
        res.send('Data deleted successfully');
    } catch (error) {
        res.status(400).send(`Error deleting data: ${error.message}`);
    }
};

module.exports = {
    addEmilist,
    getEmis,
    updateEmi,
    deleteEmi
};
