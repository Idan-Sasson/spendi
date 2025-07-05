import { useAddExpense } from "./useAddExpense"
import { useLocalStorage } from "../useLocalStorage";
import { getAllExpenses } from "./getAllExpenses";

export const useSyncExpenses = () => {  // Adds all the expenses from localStorage that don't have an id (means they are not on firebase) to firebase
    const { addExpense } = useAddExpense();
    const [expenses, setExpenses] = useLocalStorage("expenses", [])

    const syncExpenses = async (userID) => {
        try {
            let updated = [...expenses];
            for (const expense of expenses) {
                if (expense.id) continue; // Skip if already synced
                const fbId = await addExpense(expense, userID);
                if (fbId) {
                    updated = updated.map((exp) =>
                        exp.expenseId === expense.expenseId ? { ...exp, id: fbId, userID } : exp
                    );
                }
            }

            const fbExpenses = await getAllExpenses(userID);
            setExpenses(fbExpenses);
            return fbExpenses;  // Return the updated expenses from firebase
        } catch (err) {
            console.error("Sync error", err)
        }
    }
    return { syncExpenses }
}