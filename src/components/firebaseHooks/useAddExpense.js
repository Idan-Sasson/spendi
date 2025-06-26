
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../config/firebase"
import { useGetUserInfo } from "./useGetUserInfo"
import { useLocalStorage } from "../useLocalStorage";

export const useAddExpense = () => {
    const { userID: hookUserId } = useGetUserInfo();
    // const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const addExpense = async (expense, passedId = null) => {
        const userID = hookUserId || passedId;
        if (!userID) return;

        try {
            const docRef = await addDoc(collection(db, "expenses"), {
                ...expense,
                userID: userID,
            });
            return docRef.id  // Firebase's expense ID

        } catch (err) {
            console.error(err);
        }
    }

    return { addExpense };
};