import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

export const getAllExpenses = async (userID) => {
    // console.log("USERID", userID);
    if (!userID) return;

    const expensesRef = collection(db, "expenses");
    const q = query(expensesRef, where("userID", "==", userID));
    // console.log(q);

    const snapshot = await getDocs(q);
    // console.log(snapshot);
    return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
};