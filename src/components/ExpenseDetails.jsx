import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './ExpenseDetails.css';

const ExpenseDetails = () => {
    const [expenses] = useLocalStorage('expenses', []);
    const { id } = useParams();
    const expense = expenses.find(exp => exp.id === Number(id));
    const [selectedDate, setSelectedDate] = useState(new Date(Number(id)).toISOString().split('T')[0]);
    // const handleChange()
    return (
        <div>
            <h1>{expense.name}</h1>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="date-input" placeholderText='24'/>
            {/* <h2>{new Date(Number(id)).toLocaleString()}</h2> */}
            <h4>{expense.price}</h4>

        </div>
    );
};

export default ExpenseDetails;