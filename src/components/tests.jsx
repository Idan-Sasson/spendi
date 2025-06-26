import { useState, useEffect, useRef } from "react";
import countries from "./countries.json"
import { useLocalStorage } from "./useLocalStorage";
import { icons } from "./constants";
import { getSymbol, setIconColor } from "./HelperFunctions";
import { color } from "chart.js/helpers";
import { db, auth } from "../config/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { useGetAllExpenses } from "./firebaseHooks/useGetAllExpenses";
import { useAddExpense } from "./firebaseHooks/useAddExpense";
import { getAllExpenses } from "./firebaseHooks/getAllExpenses";

export default function Tests() {
    console.log(getAllExpenses("pnwF52jchcbmI8TbWxeR88BpN742"))
    useEffect(() => {
        const t = async () => {
        const ex = await getAllExpenses("pnwF52jchcbmI8TbWxeR88BpN742")
        console.log(ex);
        }
        t();
    }, [])
    const { addExpense } = useAddExpense();
    // const expenses = useGetAllExpenses();
    // console.log(expenses);

    // useAddExpense();
    // const [data, setData] = useState("")
    const [expenses, setExpenses] = useLocalStorage("expenses", []);
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

    const handleSubmit = async() => {
        const category = "Car";
        const convertedPrice = 2;
        const country = "Israel";
        const currency = "ils";
        const date = new Date().getTime();
        // const userID = auth?.currentUser?.uid;
        const expenseId = new Date().getTime();
        const name = "Matanot";
        const note = "";
        const price = 2;
        const rate = 1;

        await addExpense({
          category: category,
          convertedPrice: convertedPrice,
          country: country,
          currency: currency,
          date: date,
          name: name,
          note: note,
          price: price,
          rate: rate,
        })  

        // await addDoc(expenseRef, {expenseId: expenseId, category: category, convertedPrice: convertedPrice, country: country, currency: currency,
        //     date: date, userID: userID, name: name, note: note, price: price, rate: rate})

    }

    // const [coloredSrc, setColoredSrc] = useState(null);
    // useEffect(() => {
    // setExpenses()})
    // const [iconUrl, setIconUrl] = useState(null);

    // useEffect(() => {
    //     setIconColor(icons["Back"], [255, 0, 0]).then(setColoredSrc)
    // }, [])

const updatedExpenses = expenses.map(({ id, ...rest }) => ({
  ...rest,
  expenseId: id
}));
    useEffect(() => {setExpenses(updatedExpenses);}, [])

    // console.log(getSymbol("ils"));

    return (
        <div>TEST
            {/* <img src={coloredSrc} alt="Back icon" /> */}
            <button onClick={handleSubmit}>Add expense</button>
        </div>
    );
}