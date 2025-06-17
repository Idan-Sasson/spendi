import { useState } from "react";
import './AddExpenseModal.css'
import CategoryModal from "./CategoryModal";
import { categories, icons, AppOptions } from './constants';
import { setAlpha } from "./HelperFunctions";
import countries from "./countries.json"
import CountryModal from "./CountryModal";

export default function AddExpenseModal({ setIsOpen, expenses, setExpenses }) {
  const [modalExpense, setModalExpense] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(Date.now())
  // const [expenses, setExpenses] = useLocalStorage("expenses", []);
  const [category, setCategory] = useState("General");
  const [isClosing, setIsClosing] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [country, setCountry] = useState("Israel");
  const [note, setNote] = useState("");
  const [isAddNote, setIsAddNote] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  // const [convertedPrice, setConvertedPrice] = useState("");

  const handleModalSubmit = () => {
    if (modalExpense.trim() === "" || modalPrice.trim() === "") return; // Blank input check
    handleClose();

    const saveExpense = async () => {
      let convertedPrice = modalPrice;
      let rate = 1;
      // setConvertedPrice(modalPrice);
      if (countries[country] !== AppOptions.baseCurrency) {
        // Convert currency
        const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${AppOptions.baseCurrency}.json`);
        const data = await response.json();
        rate = data[AppOptions.baseCurrency][countries[country]]
        convertedPrice = (modalPrice / data[AppOptions.baseCurrency][countries[country]])
        // setConvertedPrice(data[countries[country]][AppOptions.baseCurrency] * modalPrice);
      }
    const newExpense = {  // id - current timestamp
      id: Date.now(),
      name: modalExpense,
      price: parseFloat(modalPrice),  // Original price
      date: selectedDate,
      category: category,
      currency: countries[country],
      convertedPrice: parseFloat(convertedPrice),  // Price after conversion
      country: country,
      rate: rate,
      note: note
    }
    setIsAdd(true);
    setExpenses([...expenses, newExpense]);
    };
    saveExpense();

  };

  // const countries = Object.values(currencies).flatMap(countries => countries).sort();

  const handleClose = () => {
    // if (isCountryOpen) {
    //   setIsCountryOpen(false);
    //   return
    // }
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsOpen(false);
      // if (isAdd) window.location.reload();  // Arabic solution
    }
  };

  const handlePriceChange = (e) => {
    const isValidNumber = str => /^-?\d*\.?\d*$/.test(str);
    if (!isValidNumber(e.target.value)) return;
    setModalPrice(e.target.value)
  }

  const categoryColor = categories.find(cat => cat.name === category).color;
  return (
    <div className={'modal-overlay'} onClick={handleClose}>

      <div className={`modal-container ${isClosing ? 'fade-out' : ''}`} onClick={(e) => e.stopPropagation()} onAnimationEnd={handleAnimationEnd} style={{boxShadow: `0 0 32px 0 ${setAlpha(categoryColor, 0.2)}`}}>

        <div className='modal-bg-image' style={{ backgroundImage: `url(${icons[category]})` }} />
        Add Expense
          <input className="new-expense-input"
            value={modalExpense}
            onChange={(e) => setModalExpense(e.target.value)}
            placeholder="Expense"
          />
          <input className="new-price-input"
            // type='number'
            value={modalPrice}
            onChange={handlePriceChange}
            placeholder="Price" />
          <div className="aem-cat-wrapper">
            <div className='open-cat-container' onClick={() => setIsCatOpen(true)} style={{backgroundColor: categoryColor}}>
              <img src={icons[category]} className="open-cat" />
            </div>
            <div className="aem-currency-wrapper">
              <span className="aem-country-select" onClick={() => setIsCountryOpen(true)} style={{backgroundColor: setAlpha(categoryColor, 0.3)}}>{country}</span>
            </div>
          </div>
          <input type="date" value={new Date(selectedDate).toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value).getTime())} className="date-input" />

          <div>
            {(!isAddNote) && <button onClick={() => setIsAddNote(true)} className="add-note-button">Add description</button>}
            {(isAddNote) && <textarea className='note' placeholder="Description" onChange={(e) => setNote(e.target.value)}/>}
          </div>
          <div>
            {isCatOpen && <CategoryModal setIsOpen={setIsCatOpen} setCategory={setCategory}/>}
          {isCountryOpen && <CountryModal setIsOpen={setIsCountryOpen} selectedCountry={country} setSelectedCountry={setCountry} categoryColor={categoryColor} wrapperPosition={{top: '45%', right: '15%', height: '40vh'}}/>}

          </div>
          <img src={icons["Plus"]} className="add-button" onClick={handleModalSubmit}/>
          <button className="close-button" onClick={handleClose}>X</button>
      </div>
    </div>
  );
}
