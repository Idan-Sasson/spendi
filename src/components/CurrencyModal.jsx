import { useEffect, useState, useRef } from "react";
import countries from "./countries.json";
import './CurrencyModal.css'
import ReactDOM from 'react-dom'

export default function CurrencyModal({selectedCurrency, setSelectedCurrency, categoryColor}) {
    const selectedRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);
    const [search, setSearch] = useState('');
    const currencies = [...new Set(Object.values(countries))];
    const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);
    const [isOpen, setIsOpen] = useState(false);

    const handleCurrencyClick = (currency) => {
        setSelectedCurrency(currency);
    }

  return (
    <div>
      <div className="cur-title" onClick={() => setIsOpen(true)}>{selectedCurrency}</div>
      {isOpen && 
        <div className="cur-modal-container">
          <div className='cur-modal-overlay' onClick={(e) => {setIsOpen(false); e.stopPropagation()}}></div>
            <div className="cur-dropdown-container">
              {currencies.map(currency => 
                <div className="currency-title">{currency}</div>
              )}
            </div>
          </div>
        }
    </div>
  )
}
