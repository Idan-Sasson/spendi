import { useState } from 'react';
import './CategoryModal.css';
import ReactDOM from 'react-dom'
import { categories, icons } from './constants';
import { setAlpha } from './HelperFunctions';

export default function CategoryModal( {setIsOpen, setCategory, onClose} ) {
    const [isClosing, setIsClosing] = useState(false);
  
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
      <div className='wrapper'>
        <div className={`top-bar ${isClosing ? 'go-out' : ''}`} />
        <div className={`categories-container ${isClosing ? 'go-out' : ''}`} onAnimationEnd={handleAnimationEnd}>

          {categories.map((cat) => 
            <div key={cat.name} className='category-item'>
              <div className='button-wrapper'>
                <div className='back-color' style={{backgroundColor: setAlpha(cat.color, 1)}}></div>
                  <button key={cat.name} className={`category-button ${cat.name}`} 
                          style={{ backgroundColor: setAlpha(cat.color, 0.6), boxShadow: ` 0 2px 20px ${setAlpha(cat.color, 0.5)}`,
                          border: `1px solid ${setAlpha(cat.color, 0.9)}`}} 
                          onClick={() => handleClick(cat.name)}>
                    <img src={icons[cat.name]} alt='icon' className='cat-icons'/>
                  </button>
                </div>
            <div className='category-title'>{cat.name}</div>
          </div>
          )}
          {/* <div className='income-container'>
            <img src={icons["Shopping"]} alt='icon' className='income'/>
          </div> */}
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