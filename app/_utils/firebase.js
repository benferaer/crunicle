import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"; // Add addDoc here
import { format } from "date-fns"; // Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize and export Firestore instance

// Fetch runs for a specific user
export const fetchUserRuns = async (userId) => {
  try {
    const runsRef = collection(db, "runs"); // Reference to the "runs" collection
    const q = query(runsRef, where("userId", "==", userId)); // Query runs where userId matches
    const querySnapshot = await getDocs(q);

    // Map the results to an array of run objects
    const runs = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: format(data.date.toDate(), "yyyy-MM-dd"), // Convert Firestore timestamp to "yyyy-MM-dd"
      };
    });

    return runs; // Return the fetched runs
  } catch (error) {
    console.error("Error fetching runs:", error);
    throw error; // Re-throw the error for handling
  }
};

// Function to add a new run to Firestore
export const addNewRun = async (runData) => {
  try {
    const docRef = await addDoc(collection(db, "runs"), runData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the document ID
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

// Function to delete a run from Firestore
export const deleteRun = async (runId) => {
  try {
    const runDocRef = doc(db, "runs", runId); // Reference to the specific run document
    await deleteDoc(runDocRef); // Delete the document
    console.log(`Run with ID ${runId} has been deleted.`);
  } catch (error) {
    console.error("Error deleting run:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

// Function to update a run in Firestore
export const updateRun = async (runId, updatedData) => {
  try {
    const runDocRef = doc(db, "runs", runId); // Reference to the specific run document
    await updateDoc(runDocRef, updatedData); // Update the document with the new data
    console.log(`Run with ID ${runId} has been updated.`);
  } catch (error) {
    console.error("Error updating run:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};