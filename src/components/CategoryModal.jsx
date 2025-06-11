import { useState } from 'react';
import './CategoryModal.css';
import ReactDOM from 'react-dom'
import { categories, categoryIcons } from './constants';
// import groceries from '../assets/icons/groceries.png'

export default function CategoryModal( {setIsOpen, setCategory, onClose} ) {
    const handleClick = (cat) => {
      setCategory(cat);
      setIsOpen(false);
      if (onClose) onClose(cat);
    }
    // console.log(groceries);
    return ReactDOM.createPortal(
      <div className='wrapper'>
        <div className='categories-container'>
          {categories.map((cat) => 
            <div key={cat.name} className='category-item'>
            <button key={cat.name} className={`category-button ${cat.name}`} style={{ backgroundColor: cat.color}} onClick={() => handleClick(cat.name)}>
              <img src={categoryIcons[cat.name]} alt='icon' className='cat-icons'/>
            </button>
            <div className='category-title'>{cat.name}</div>
          </div>
          )}
          <div>
            <button onClick={() => setIsOpen(false)} className='close'>Close</button>
          </div>
        </div>
      </div>,
        document.body

    )
}