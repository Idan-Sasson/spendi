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
    // const { deleteExpense } = useDeleteExpense();
    // useEffect(() => {
    //     const getExpenses
    //     const expenses = await getAllExpenses(userID)
    //     console.log(expenses);
    // })

    const deleteDupes = () => {
        const dupesRemoved = expenses.reduce((acc, expense) => {
            if (!acc.some(exp => exp.expenseId === expense.expenseId)) {
                acc.push(expense);
            }
            return acc;
        }, []);
        console.log(dupesRemoved);
        setExpenses(dupesRemoved);
    }

    const logDupes = () => {
        const counts = {}
        // Count how many expenseId there is for each unique expenseId
        for (const expense of expenses) {
            const expenseId = expense.expenseId;
            counts[expenseId] = (counts[expenseId] || 0) + 1;  // Add 1 to the counter
        }
        // console.log(counts);

        // Delete those who have only 1 (not a duplicate)
        // const duplicates = Object.fromEntries(Object.entries(counts).filter(([_, count]) => count > 1).map(([id, count]) => [id, count]));
        // console.log(Object.keys(duplicates));
        const duplicates = expenses.filter(exp => counts[exp.expenseId] > 1);
        console.log(duplicates)
    }

    const logExpenses = async () => {
        const expenses = await getAllExpenses(userID)
        console.log(expenses);
    }

    // const [calc, setCalc] = useState('');
    // const [result, setResult] = useState('');
    // console.log(getAllExpenses("pnwF52jchcbmI8TbWxeR88BpN742"))
    // useEffect(() => {
    //     const t = async () => {
    //     const expenses = await getAllExpenses(userID)
    //     expenses.map(expense => {
    //         // console.log(!expense.expenseId);
    //         if (!expense.expenseId) {
    //             deleteExpense(expense.id);
    //             // console.log(expense.expenseId);
    //             console.log(expense.name);
    //             console.log(expense.expenseId);
    //         }
    //     })
    //     // console.log(ex);
    //     }
    //     t();
    // }, [])
    // const { addExpense } = useAddExpense();
    // const expenses = useGetAllExpenses();
    // console.log(expenses);

    // useAddExpense();
    // const [data, setData] = useState("")
    // const [expenses, setExpenses] = useLocalStorage("expenses", []);
    // const [fbExpenses, setFbExpenses] = useState([])
    // const expenseRef = collection(db, "expenses");


//     const getExpensesList = async () => {
//     try {
//         const data = await getDocs(expenseRef);
//         // console.log(data);
//         const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
//         // console.log(filteredData);
//     }
//     catch (err) {
//         console.error(err)
//     }
// }
//     useEffect(() => {
//         getExpensesList();
//     }, [])

    // const handleSubmit = async() => {
    //     const category = "Car";
    //     const convertedPrice = 2;
    //     const country = "Israel";
    //     const currency = "ils";
    //     const date = new Date().getTime();
    //     // const userID = auth?.currentUser?.uid;
    //     const expenseId = new Date().getTime();
    //     const name = "Matanot";
    //     const note = "";
    //     const price = 2;
    //     const rate = 1;

    //     await addExpense({
    //       category: category,
    //       convertedPrice: convertedPrice,
    //       country: country,
    //       currency: currency,
    //       date: date,
    //       name: name,
    //       note: note,
    //       price: price,
    //       rate: rate,
    //     })  

        // await addDoc(expenseRef, {expenseId: expenseId, category: category, convertedPrice: convertedPrice, country: country, currency: currency,
        //     date: date, userID: userID, name: name, note: note, price: price, rate: rate})

    // }

    // const [coloredSrc, setColoredSrc] = useState(null);
    // useEffect(() => {
    // setExpenses()})
    // const [iconUrl, setIconUrl] = useState(null);

    // useEffect(() => {
    //     setIconColor(icons["Back"], [255, 0, 0]).then(setColoredSrc)
    // }, [])

// const updatedExpenses = expenses.map(({ id, ...rest }) => ({
//   ...rest,
//   expenseId: id
// }));
    // useEffect(() => {setExpenses(updatedExpenses);}, [])

    // console.log(getSymbol("ils"));

    return (
        <div>TEST
        <div>
            <button onClick={logExpenses}>Get all expenses</button>
            <button onClick={logDupes}>Log duplicates</button>
            <button onClick={deleteDupes}>Delete duplicates</button>
        </div>
            {/* <img src={coloredSrc} alt="Back icon" /> */}
            {/* <button onClick={handleSubmit}>Add expense</button> */}
            {/* <Calculator calc={calc} setCalc={setCalc} setResult={setResult} display={true}/> */}
        </div>
    );
}