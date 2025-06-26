import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useGetUserInfo } from "./useGetUserInfo"
export const useUpdateExpense = () => {
    const { userID } = useGetUserInfo();
    const updateExpense = async (expense, fbId) => {
        if (!userID || !fbId) return // User is not connected OR Expense is not on firebase
        try {
            const expenseRef = doc(db, "expenses", fbId);
            await updateDoc(expenseRef, expense);

        } catch (err) {
            console.error("Error updating firebase expense", err)
        }

    }
    return { updateExpense }
}