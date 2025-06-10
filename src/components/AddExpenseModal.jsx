import { useState } from "react";
import './AddExpenseModal.css'
import CategoryModal from "./CategoryModal";
import { useLocalStorage } from "./useLocalStorage";

export default function AddExpenseModal( {setIsOpen} ) {
  const [modalExpense, setModalExpense] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(Date.now())
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  const [category, setCategory] = useState("General");
  const [isClosing, setIsClosing] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);

  const handleModalSubmit = () => {
    if (modalExpense.trim() === "" || modalPrice.trim() === "") return; // Blank input check
    const newExpense = {  // id - current timestamp
      id: Date.now(),
      name: modalExpense,
      price: parseFloat(modalPrice),
      date: selectedDate,
      category: category
    };
    console.log(expenses);
    console.log(newExpense);
    setExpenses([...expenses, newExpense]);
    console.log(expenses);
    handleClose();
  };


  const handleClose = () => {
    setIsClosing(true);

  };

  const handleAnimationEnd = () => {
    if (isClosing) {
    setIsOpen(false);
    window.location.reload();  // Arabit solution
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
          <button className="openCat" onClick={() => setIsCatOpen(true)}>{category}</button>
          <div>
            {isCatOpen && <CategoryModal setIsOpen={setIsCatOpen} setCategory={setCategory}/>}
          </div>
          <span className="add-button" onClick={handleModalSubmit}>+</span>
          <button className="close-button" onClick={handleClose}>X</button>
      </div>
    </div>
  );
}
