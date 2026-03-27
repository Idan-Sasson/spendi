import { useState, useEffect, useRef } from "react";
import countries from "./countries.json"
import { useLocalStorage } from "./useLocalStorage";
import { icons } from "./constants";
import { getSymbol, setIconColor, useDeleteDuplications } from "./HelperFunctions";
import { color } from "chart.js/helpers";
import { db, auth } from "../config/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { useGetAllExpenses } from "./firebaseHooks/useGetAllExpenses";
import { useAddExpense } from "./firebaseHooks/useAddExpense";
import { getAllExpenses } from "./firebaseHooks/getAllExpenses";
import Calculator from "./customs/Calculator";
import { useGetUserInfo } from "./firebaseHooks/useGetUserInfo";
import { useDeleteExpense } from "./firebaseHooks/useDeleteExpense";

export default function Tests() {

    const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const { userID } = useGetUserInfo();
    const { deleteExpense } = useDeleteExpense();

    const deleteDupes = () => {
        const counts = {}

        for (const expense of expenses) {
            const expenseId = expense.expenseId;
            counts[expenseId] = (counts[expenseId] || 0) + 1;  // Add 1 to the counter
        }
        const duplicates = expenses.filter(exp => counts[exp.expenseId] > 1);
        const original = duplicates[0]
        for (const duplicate of duplicates) {
            if (duplicate == original)
                continue;
            console.log("duplicate");
            console.log(duplicate.id);
            deleteExpense(duplicate.id);
            const updated = expenses.filter((item) => item.id !== duplicate.id);
            setExpenses(updated); // Deletes from local storage
        }
        console.log("OG");
        console.log(original);

    }

    const logDupes = () => {
        const counts = {}
        // Count how many expenseId there is for each unique expenseId
        for (const expense of expenses) {
            const expenseId = expense.expenseId;
            counts[expenseId] = (counts[expenseId] || 0) + 1;  // Add 1 to the counter
        }
        const duplicates = expenses.filter(exp => counts[exp.expenseId] > 1);
        console.log(duplicates)
    }

    const logExpenses = async () => {
        const expenses = await getAllExpenses(userID)
        console.log(expenses);
    }

    return (
        <div>TEST
        <div>
            <button onClick={logExpenses}>Get all expenses</button>
            <button onClick={logDupes}>Log duplicates</button>
            <button onClick={deleteDupes}>Delete duplicates</button>
        </div>
        </div>
    );
}