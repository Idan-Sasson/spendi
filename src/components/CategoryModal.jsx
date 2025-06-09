import { useState } from 'react';
import './CategoryModal.css';
import ReactDOM from 'react-dom'

export default function CategoryModal( {setIsOpen, setCategory, onClose} ) {

    const categories = ["General", "Food", "Transport", "Entertainment", "Groceries", "Utilities", "Other"];
    
    const handleClick = (cat) => {
      setCategory(cat);
      setIsOpen(false);
      if (onClose) onClose(cat);
    }

    return ReactDOM.createPortal(
      <div className='categories-wrapper'>
        <div className='categories-container'>
          {categories.map((cat) => 
          <button key={cat} className={`category-button ${cat}`} onClick={() => handleClick(cat)}>
            {cat}
          </button>)}
          <div>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      </div>,
        document.body

    )
}