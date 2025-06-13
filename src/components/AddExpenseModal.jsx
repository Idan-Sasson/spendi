import { useState } from "react";
import './AddExpenseModal.css'
import CategoryModal from "./CategoryModal";
import { useLocalStorage } from "./useLocalStorage";
import { categories, icons } from './constants';
import { setAlpha } from "./HelperFunctions";

export default function AddExpenseModal( {setIsOpen} ) {
  const [modalExpense, setModalExpense] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(Date.now())
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  const [category, setCategory] = useState("General");
  const [isClosing, setIsClosing] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const handleModalSubmit = () => {
    if (modalExpense.trim() === "" || modalPrice.trim() === "") return; // Blank input check
    const newExpense = {  // id - current timestamp
      id: Date.now(),
      name: modalExpense,
      price: parseFloat(modalPrice),
      date: selectedDate,
      category: category
    };
    setExpenses([...expenses, newExpense]);
    setIsAdd(true);
    handleClose();
  };


  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsOpen(false);
      if (isAdd) window.location.reload();  // Arabic solution
    }
  };
  
  const categoryColor = categories.find(cat => cat.name === category).color;
  return (
    <div className={'modal-overlay'}>

      <div className={`modal-container ${isClosing ? 'fade-out' : ''}`} onAnimationEnd={handleAnimationEnd} style={{boxShadow: `0 0 32px 0 ${setAlpha(categoryColor, 0.2)}`}}>
        <div className='modal-bg-image' style={{ backgroundImage: `url(${icons[category]})` }} />
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
          <div className='open-cat-container' onClick={() => setIsCatOpen(true)} style={{backgroundColor: categoryColor}}>
            <img src={icons[category]} className="open-cat" />
          </div>
          <div>
            {isCatOpen && <CategoryModal setIsOpen={setIsCatOpen} setCategory={setCategory}/>}
          </div>
          <img src={icons["Plus"]} className="add-button" onClick={handleModalSubmit}/>
          <button className="close-button" onClick={handleClose}>X</button>
      </div>
    </div>
  );
}
