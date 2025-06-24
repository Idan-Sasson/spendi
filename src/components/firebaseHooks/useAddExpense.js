
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../config/firebase"
import { useGetUserInfo } from "./useGetUserInfo"

export const useAddExpense = () => {
    const { userID } = useGetUserInfo();
    const addExpense = async (expense) => {
        if (!userID) return;

        try {
            await addDoc(collection(db, "expenses"), {
                ...expense,
                expenseId: new Date().getTime(),
                userID: userID,
            });
        } catch (err) {
            console.error(err);
        }
    }

    return { addExpense };
};