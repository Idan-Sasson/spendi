import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

export const getAllExpenses = async (userID) => {
    if (!userID) return;

    const expensesRef = collection(db, "expenses");
    const q = query(expensesRef, where("userID", "==", userID));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
};