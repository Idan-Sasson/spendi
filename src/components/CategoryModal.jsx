import { useState } from 'react';
import './CategoryModal.css';
import ReactDOM from 'react-dom'
import { categories, icons } from './constants';
import { convertCategories, setAlpha } from './HelperFunctions';
import { useLocalStorage } from './useLocalStorage';

export default function CategoryModal( {setIsOpen, setCategory, onClose} ) {
    const [isClosing, setIsClosing] = useState(false);
    const [savedCategories, setSavedCategories] = useLocalStorage("savedCategories", []);

    const getColor = (category) => {
        return savedCategories[category] || convertCategories()[category].color
    }
  
    const handleClick = (cat) => {
      setCategory(cat);
      // setIsOpen(false);      handleClose()
      if (onClose) onClose(cat);
      setIsClosing(true);
    }

    const handleClose = () => {
      setIsClosing(true)
    }

    const handleAnimationEnd = () => {
      if (isClosing) {
        setIsOpen(false)
      }
    }

    // console.log(groceries);
    return ReactDOM.createPortal(
      <div className='wrapper' onClick={handleClose}>
        <div className={`top-bar ${isClosing ? 'go-out' : ''}`} />
        <div className={`categories-container ${isClosing ? 'go-out' : ''}`} onAnimationEnd={handleAnimationEnd} onClick={(e) => e.stopPropagation()}>
          {/* <div className='expenses-container'> */}
          {categories.map((cat) => 
            <div key={cat.name} className='category-item'>
              <div className='button-wrapper'>
                <div className='back-color' style={{backgroundColor: setAlpha(getColor(cat.name), 1)}}></div>
                  <button key={cat.name} className={`category-button ${cat.name}`} 
                          style={{ backgroundColor: setAlpha(getColor(cat.name), 0.6), boxShadow: ` 0 2px 20px ${setAlpha(getColor(cat.name), 0.5)}`,
                          border: `1px solid ${setAlpha(getColor(cat.name), 0.9)}`}} 
                          onClick={() => handleClick(cat.name)}>
                    <img src={icons[cat.name]} alt='icon' className='cat-icons'/>
                  </button>
                </div>
            <div className='category-title'>{cat.name}</div>
          </div>
          )}
          <div>
            <div className={`close-container ${isClosing ? 'closeDown' : ''}`}>
              <img src={icons['Back']} onClick={handleClose} className={`close ${isClosing ? 'closeDown' : ''}`} />
            </div>
          </div>
        </div>
      </div>,
        document.body

    )
}