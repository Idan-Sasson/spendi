import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import AddButton from './AddButton';
import './Income.css'


export default function Income() {

    const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const filteredIncome = expenses.filter(item => item.price < 0);
    const groupedDate = filteredIncome.reduce((result, item) => {
        const isoDate = new Date(item.date).toISOString().split('T')[0];
        if (!result[isoDate]) {
            result[isoDate] = []
        }
        result[isoDate].push(item);
        return result;
    }, {});
    const dateKeys = Object.entries(groupedDate).sort((a, b) => new Date(a[0]) - new Date(b[0]));
    // console.log(groupedDate);
    // console.log(dateKeys)
    return (
        <div>
            <AddButton  expenses={expenses} setExpenses={setExpenses}/>
            <div>Income</div>
            <div className="income-container">
                {filteredIncome.map(income => (
                    <div key={income.id} className="item-container">
                    <span className="income-name">{income.name}</span>
                    <span className="income-price">{income.price}</span>
                    <span className="income-date">{income.date}</span>
                    <span className="income-cat">{income.category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}