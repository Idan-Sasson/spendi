import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import './ExpenseDetails.css';

const ExpenseDetails = () => {
  const [expenses, setExpenses] = useLocalStorage('expenses', []);
  const { id } = useParams();
  const expense = expenses.find(exp => exp.id === Number(id));
    

  const ogName = useRef(expense.name);
  const [name, setName] = useState(expense.name);
  const [price, setPrice] = useState(expense.price);
  const [selectedDate, setSelectedDate] = useState(
    new Date(expense.date).toISOString().split('T')[0]
  );
if (!expense) return <div>Expense not found</div>;

  const updateExpense = (updatedField) => {
    const updatedExpenses = expenses.map(exp => {
      if (exp.id === Number(id)) {
        return { ...exp, ...updatedField };
      }
      return exp;
    });
    setExpenses(updatedExpenses);
  };


  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);  // Shows the new date in the input  
    updateExpense({ date: new Date(newDate).getTime() });
  };

  const handleTitleChange = (e) => {
    const newName = e.target.value.trim();
    setName(e.target.value);  // Updates the input field with the new name
    // If the new name is empty, revert to the original name
    // Otherwise, update the expense with the new name
    if (newName === '') {
      updateExpense({ name: ogName.current });
    }
    else {
      updateExpense({ name: newName });
    }
  };

  const handlePriceChange = (e) => {
    // console.log(e.target.value.slice(1))
    // const isOnlyNumbers = str => /^\d+$/.test(str);
    // console.log(isOnlyNumbers(e.target.value.slice(1)))
    // if (!isOnlyNumbers(e.target.value.slice(1))) return
    const newPrice = parseFloat(e.target.value);
    // setPrice(newPrice); // Updates the input field with the new price
    if (isNaN(newPrice)) {
      setPrice("")
      updateExpense({ price: 0 });
    } else {
      setPrice(newPrice);
      updateExpense({ price: newPrice });
    }
  };

  return (
    <div>
      <div className='name-container'>
        <input className="name-input" value={name} onChange={handleTitleChange} placeholder={ogName.current} />
      </div>
      <div className='date-container'>
        <input className="date-input" type="date" value={selectedDate} onChange={handleDateChange}  />
      </div>
      <div className="price-container">
        <input className="price-input" value={price} onChange={handlePriceChange} placeholder={expense.price} />
      </div>
    </div>
  );
};

export default ExpenseDetails;
