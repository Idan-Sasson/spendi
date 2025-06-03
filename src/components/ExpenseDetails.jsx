import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import './ExpenseDetails.css';

const ExpenseDetails = () => {
  const [expenses, setExpenses] = useLocalStorage('expenses', []);
  const { id } = useParams();
  const expense = expenses.find(exp => exp.id === Number(id));
  const expDate = expense.date;
  const [selectedDate, setSelectedDate] = useState(
    new Date(expDate).toISOString().split('T')[0]
  );

  const handleChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    const updatedExpenses = expenses.map(exp => {
      if (exp.id === Number(id)) {
        return { ...exp, date: new Date(newDate).getTime() };
      }
      return exp;
    });

    setExpenses(updatedExpenses);
  };

  if (!expense) return <div>Expense not found</div>;

  return (
    <div>
      <h1>{expense.name}</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={handleChange}
        className="date-input"
      />
      <h4>{expense.price}₪</h4>
    </div>
  );
};

export default ExpenseDetails;
