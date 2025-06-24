
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "../../config/firebase"
import { useGetUserInfo } from "./useGetUserInfo"

export const useDeleteExpense = () => {
    const { userID } = useGetUserInfo();
    const deleteExpense = async (id) => {
        if (!userID) return;

        try {
            const expenseRef = doc(db, "expenses", id);
            await deleteDoc(expenseRef)
        } catch (err) {
            console.error(err);
        }
    }

    return { deleteExpense };
};