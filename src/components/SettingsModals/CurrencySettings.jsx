import React, { useState } from 'react'
import { AppOptions } from '../constants'
import countries from "../countries.json";
import { useLocalStorage } from '../useLocalStorage';
import CustomNotification from '../customs/CustomNotification';
import { createPortal } from 'react-dom';

export default function CurrencySettings({ setIsOpen }) {
    const [isClosing, setIsClosing] = useState(false);
    const [config, setConfig] = useLocalStorage("config", {})
    const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const [selectedBaseCurrency, setSelectedBaseCurrency] = useState(config["baseCurrency"] || AppOptions.baseCurrency)
    const [isNotification, setIsNotification] = useState(false);


    const handleClose = async () => {
        setIsClosing(true);
        // Add baseCurrency to localStorage and edit it
        setConfig(prev => ({ ...prev, "baseCurrency":  selectedBaseCurrency}))

        // Fetch data
        const getRates = async () => {
            try {
                console.log("Fetching");
                const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${selectedBaseCurrency}.json`);
                if (!response.ok){ // No internet 
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                // console.log(data);
                return data;
                // let newRate = data[AppOptions.baseCurrency][countries[selectedCountry]];
                // setRate(newRate);
            }
            catch (error) {  // For any error with fetching the data, alert via notification
                setIsNotification(true);
                return
            }
        }
        const data = await getRates();
        // Loop through expenses are change every rate and convertedPrice to the new results
        const tmpExpenses = [...expenses] // JUST FOR TESTING, DONT WANNA FUCK THE WHOLE THING :)
        // console.log(tmpExpenses);
        const rates = data[selectedBaseCurrency]
        const updatedExpenses = tmpExpenses.map(expense => { // FIX FAX
            const newRate = rates[expense.currency];
            const newConverted = newRate * expense.price;
            return {...expense, convertedPrice: newConverted, rate: newRate}
        })
        console.log(updatedExpenses);
        // data[selectedBaseCurrency]
        
        // Edit expenses and update converted price, country and currency
    }

    const handleAnimationEnd = () => {
        if (isClosing) setIsOpen(false);
    }

  return (
    <div className={`cc-overlay ${isClosing ? 'slide-out' : ''}`} style={{backgroundColor: AppOptions["backgroundColor"]}} onAnimationEnd={handleAnimationEnd}>
        <div>CurrencySettings</div>
        <select className="cs-currency-select" onChange={(e) => setSelectedBaseCurrency(e.target.value)}>
        {[...new Set(Object.values(countries))].map((currency) => (
            <option key={currency} value={currency}>{currency.toUpperCase()}</option>
        ))}
        </select>
        <div className="c-close" onClick={handleClose}>Close</div>
        {isNotification && /* FIX LATER- Notification disappears with the page */
        <CustomNotification duration={3000} setIsOpen={setIsNotification} className='settings-notification'>
            <div>Error fetching data</div>
        </CustomNotification>
        }
    </div>
  )
}
