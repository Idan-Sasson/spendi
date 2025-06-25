
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../config/firebase"
import { useGetUserInfo } from "./useGetUserInfo"
import { useLocalStorage } from "../useLocalStorage";

export const useAddExpense = () => {
    const { userID } = useGetUserInfo();
    // const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const addExpense = async (expense) => {
        if (!userID) return;

        try {
            const docRef = await addDoc(collection(db, "expenses"), {
                ...expense,
                userID: userID,
            });
            return docRef.id  // Firebase's expense ID

            // Updates the localExpense with the firebase's ID (doing it later so the user doens't have to wait for the firebase update)
            // const patchedExpenses = expenses.map((exp) =>
            //     Number(exp.expenseId) === Number(expense.expenseId)
            //         ? { ...exp, id: fbId }
            //         : exp
            // );
            // setExpenses(patchedExpenses);
        } catch (err) {
            console.error(err);
        }
    }

    return { addExpense };
};