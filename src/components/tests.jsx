import { useState, useEffect } from "react";
import countries from "./countries.json"
import { useLocalStorage } from "./useLocalStorage";

export default function Tests() {
    const [data, setData] = useState("")
    const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const updatedExpenses = expenses.map(item => {
        return {
            ...item, 
            rate: 1
        }
    })
 
    useEffect(() => {setExpenses(updatedExpenses);}, [])
    // console.log(updatedExpenses);

    // fix expenses


    // useEffect(() => {
    //     fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/ils.json").then(response => response.json())
    //     .then(result => {
    //         setData(result);
    //     });
    // }, []);

    // console.log(data["ils"]["pen"]);
    return (
        <div>TEST</div>
    );
}