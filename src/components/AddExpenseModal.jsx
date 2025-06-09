import { useState } from "react";
import './AddExpenseModal.css'
import CategoryModal from "./CategoryModal";

export default function AddExpenseModal( {setIsOpen, onSubmit} ) {
  const [modalExpense, setModalExpense] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(Date.now())
  const [isClosing, setIsClosing] = useState(false);
  const [category, setCategory] = useState("General");
  const [isCatOpen, setIsCatOpen] =useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
    onSubmit({name: modalExpense, price: modalPrice, date: selectedDate, category: category})
  }

  const handleClose = () => {
    setIsClosing(true);

  };

  const handleAnimationEnd = () => {
    if (isClosing) {
    setIsOpen(false);
    }
  };

  return (
    <div className={`modal-overlay ${isClosing ? 'fade-out' : ''}`}>
      <div className={`modal-container ${isClosing ? 'fade-out' : ''}`} onAnimationEnd={handleAnimationEnd}>
        Add Expense
          <input className="new-expense-input"
            value={modalExpense}
            onChange={(e) => setModalExpense(e.target.value)}
            placeholder="Expense"
          />
          <input className="new-price-input"
              type="number"
              value={modalPrice}
              onChange={(e) => setModalPrice(e.target.value)}
              placeholder="Price" />
          <input type="date" value={new Date(selectedDate).toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value).getTime())} className="date-input" />
          {/* <div>
            <select className="category-select" onChange={(e) =>setCategory(e.target.value)} value={category}>
              <option value="General">General</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Groceries">Groceries</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </select>
          </div> */}
          <button className="openCat" onClick={() => setIsCatOpen(true)}>{category}</button>
          <div>
            {isCatOpen && <CategoryModal setIsOpen={setIsCatOpen} setCategory={setCategory}/>}
          </div>
          <span className="add-button" onClick={handleSubmit}>+</span>
          <button className="close-button" onClick={handleClose}>X</button>
      </div>
    </div>
  );
}
