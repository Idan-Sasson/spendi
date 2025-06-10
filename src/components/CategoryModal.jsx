import { useState } from 'react';
import './CategoryModal.css';
import ReactDOM from 'react-dom'
import { categories } from './constants';

export default function CategoryModal( {setIsOpen, setCategory, onClose} ) {
    const handleClick = (cat) => {
      setCategory(cat);
      setIsOpen(false);
      if (onClose) onClose(cat);
    }

    return ReactDOM.createPortal(
      <div className='categories-wrapper'>
        <div className='categories-container'>
          {categories.map((cat) => 
          <button key={cat.name} className={`category-button ${cat.name}`} style={{ backgroundColor: cat.color}} onClick={() => handleClick(cat.name)}>
            {cat.name}
          </button>)}
          <div>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      </div>,
        document.body

    )
}