import { useState } from "react";
import './ExpenseModal.css'

export default function ExpenseModal( {setIsOpen, onSubmit} ) {
  const [modalExpense, setModalExpense] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(Date.now())
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({name: modalExpense, price: modalPrice, date: selectedDate})
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        Enter Expense
          <input className="expense-input"
            value={modalExpense}
            onChange={(e) => setModalExpense(e.target.value)}
            placeholder="Expense"
          />
          <input className="price-input"
              type="number"
              value={modalPrice}
              onChange={(e) => setModalPrice(e.target.value)}
              placeholder="Price" />
          <input type="date" value={new Date(selectedDate).toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value).getTime())} className="date-input" />
          <button className="add-button" onClick={handleSubmit}>+</button>
          <button className="close-button" onClick={() => {setIsOpen(false);}}>X</button>
      </div>
    </div>
  );
}
