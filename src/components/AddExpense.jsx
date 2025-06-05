import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import "./AddExpense.css";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  const [Expense, setExpense] = useState("");
  const [Price, setPrice] = useState("");
  const [ExpDate, setExpDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Expense.trim() === "" || Price.trim() === "") return;  // Blank input check

    const newExpense = {id: Date.now(), name: Expense, price: parseFloat(Price), date: Date.now()};  // id - current timestamp
    setExpenses([...expenses, newExpense]);
    setExpense("");
    setPrice("");
  };

  // Step 1: Group the expenses by date
  const groupedExpenses = expenses.reduce((result, item) => {
    // Turn the date into something like "12.12.24"
    const isoDate = new Date(item.date).toISOString().split("T")[0];
    // If this date doesn't exist in our groups yet, create an empty list
    if (!result[isoDate]) {
      result[isoDate] = [];
    }
    // Add the item into the correct date group
    result[isoDate].push(item);
    return result;
  }, {});

  // Function to remove an expense
  const handleRemove = (id) => {
    const updated = expenses.filter(item => item.id !== id);
    setExpenses(updated);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={Expense}
          onChange={(e) => setExpense(e.target.value)}
          placeholder="Expense"
        />
        <input className="price-input"
            type="number"
            value={Price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price" />
        <button type="submit">Add</button>
      </form>

      <ul className="expense-list">
        {/* Go over each date group */}
        {Object.entries(groupedExpenses).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([isoDate, items]) => (
          <li key={isoDate}>
            <div className="date-header">
              <span className="date">{isoDate}</span>
              <span className="total"> {items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}₪ </span>
            </div>
            <ul className="expenses">
              {/* For each item under the date, show its name and price */}
              {items.map((item) => (
                <li key={item.id} onClick={() => navigate(`/expense/${item.id}`)}>
                  {item.name}: {item.price}₪
                  <button className="remove" onClick={(e) => {
                    e.stopPropagation();  // Prevent the click from bubbling up to the li
                    handleRemove(item.id);
                  }}>🗑️</button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {/* <button onClick={() => setExpenses([])}>Reset</button> */}

    </div>
  );
};

export default AddExpense;
