import { useState, useEffect } from "react";
import './AddExpenseModal.css'
import CategoryModal from "./CategoryModal";
import { useLocalStorage } from "./useLocalStorage";
import { categories, icons, AppOptions } from './constants';
import { setAlpha } from "./HelperFunctions";
import countries from "./countries.json"

export default function AddExpenseModal( {setIsOpen} ) {
  const [modalExpense, setModalExpense] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(Date.now())
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  const [category, setCategory] = useState("General");
  const [isClosing, setIsClosing] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [country, setCountry] = useState("Israel");
  // const [convertedPrice, setConvertedPrice] = useState("");

  const handleModalSubmit = () => {
    if (modalExpense.trim() === "" || modalPrice.trim() === "") return; // Blank input check
    handleClose();

    const saveExpense = async () => {
      let convertedPrice = modalPrice;
      // setConvertedPrice(modalPrice);
      if (countries[country] !== AppOptions.baseCurrency) {
        // Convert currency
        const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${countries[country]}.json`);
        const data = await response.json();
        convertedPrice = (data[countries[country]][AppOptions.baseCurrency] * modalPrice)
        // setConvertedPrice(data[countries[country]][AppOptions.baseCurrency] * modalPrice);
      }
    const newExpense = {  // id - current timestamp
      id: Date.now(),
      name: modalExpense,
      price: parseFloat(modalPrice),  // Original price
      date: selectedDate,
      category: category,
      currency: countries[country],
      convertedPrice: parseFloat(convertedPrice)  // Price after conversion
    }
    setIsAdd(true);
    setExpenses([...expenses, newExpense]);
    };
    saveExpense();

  };

  // const countries = Object.values(currencies).flatMap(countries => countries).sort();

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsOpen(false);
      if (isAdd) window.location.reload();  // Arabic solution
    }
  };
  
  // const handleCountryChange = (e) => {
  //   setCountry(e.target.value);
  //   if (countries[country] != AppOptions.baseCurrency) {
  //     // fetch from API
  //     fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${countries[country]}.json`)
  //       .then(response => response.json())
  //       .then(data => {
  //         // Update the currency based on the fetched data
  //         setConvertedPrice(data[countries[country]][AppOptions.baseCurrency]);
  //       });
  //       if (modalPrice) {
  //         setConvertedPrice((modalPrice * convertedPrice).toFixed(2));
  //       } // Otherwise will do that when user sets the price
  //     }
  // }

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
          <div className="cat-currency">
            <div className='open-cat-container' onClick={() => setIsCatOpen(true)} style={{backgroundColor: categoryColor}}>
              <img src={icons[category]} className="open-cat" />
            </div>
            <div className="currencies">
              <select className='select-country' value={country} onChange={(e) => setCountry(e.target.value)}>
                {Object.keys(countries).sort().map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
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
