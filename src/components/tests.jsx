import { useState, useEffect, useRef } from "react";
import countries from "./countries.json"
import { useLocalStorage } from "./useLocalStorage";
import { icons } from "./constants";
import { setIconColor } from "./HelperFunctions";
import { color } from "chart.js/helpers";

export default function Tests() {
    const [data, setData] = useState("")
    const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const [coloredSrc, setColoredSrc] = useState(null);

    const [iconUrl, setIconUrl] = useState(null);

    useEffect(() => {
        setIconColor(icons["Back"], [255, 0, 0]).then(setColoredSrc)
    }, [])

    // const updatedExpenses = expenses.map(item => {
    //     return {
    //         ...item, 
    //         rate: 1
    //     }
    // }) 
    // useEffect(() => {setExpenses(updatedExpenses);}, [])

    return (
        <div>TEST
            <img src={coloredSrc} alt="Back icon" />
        </div>
    );
}