import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import CategoryModal from './CategoryModal';
import CountryModal from './CountryModal';
import './ExpenseDetails.css';
import countries from "./countries.json"
import { AppOptions, icons, categories} from './constants';
import { setAlpha } from './HelperFunctions';


export default function ExpenseDetails( {setIsOpen, expenseId, expenses, setExpenses} ) {
  // const [expenses, setExpenses] = useLocalStorage('expenses', []);
  // const { id } = useParams();
  const expense = expenses.find(exp => exp.id === Number(expenseId));
  
  const ogName = useRef(expense.name);
  const [name, setName] = useState(expense.name);
  const [price, setPrice] = useState(expense.price);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [rate, setRate] = useState(expense.rate);
  const [category, setCategory] = useState(expense.category);
  const [convertedPrice, setConvertedPrice] = useState(expense.converted)
  const [selectedDate, setSelectedDate] = useState(
    new Date(expense.date).toISOString().split('T')[0]
  );
  const changedCountry = useRef(false);
  const [rates, setRates] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(expense.country);
  const [note, setNote] = useState(expense.note);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isNoteFocused, setIsNoteFocused] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false)

// if (!expense) return <div>Expense not found</div>;

  const updateExpense = (updatedField) => {
    const updatedExpenses = expenses.map(exp => {
      if (exp.id === Number(expense.id)) {
        return { ...exp, ...updatedField };
      }
      return exp;
    });
    setExpenses(updatedExpenses);
  };

useEffect(() => {
  if (note) setIsNoteOpen(true)
}, []);

useEffect(() => {
  if (!category) {
    setCategory("General");
    updateExpense({ category: "General" });
  }
}, []); // Runs only once on mount

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);  // Shows the new date in the input  
    updateExpense({ date: new Date(newDate).getTime() });
  };

  const handleTitleChange = (e) => {
    const newName = e.target.value.trim();
    setName(e.target.value);  // Updates the input field with the new name
    // If the new name is empty, revert to the original name
    // Otherwise, update the expense with the new name
    if (newName === '') {
      updateExpense({ name: ogName.current });
    }
    else {
      updateExpense({ name: newName });
    }
  };

  const handlePriceChange = (e) => {
    const isValidNumber = str => /^-?\d*\.?\d*$/.test(str);
    const newPrice = e.target.value;
    const plPrice = parseFloat(newPrice); // ParsedFloat
    if (!isValidNumber(e.target.value)) return;
    // const newPrice = parseFloat(e.target.value);
    if (newPrice === '-') {
      setPrice("-");
      setConvertedPrice(0);
      updateExpense({ price: 0, convertedPrice: 0 });
    }
    else if (isNaN(plPrice)) {
    //   console.log("nan")
      setPrice("");
      setConvertedPrice(0);
      updateExpense({ price: 0, convertedPrice: 0 });
    }
    else {
    setPrice(plPrice);
    setConvertedPrice(plPrice / rate);
    updateExpense({ price: plPrice, convertedPrice: (plPrice / rate) });
  }};

  const updateCat = (newCat) => {
    updateExpense({ category: newCat })
  }

  const handleClose = () => {
    setIsClosing(true);
  }

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsOpen(false);
    }
  }

  const handleRemove =  () => {
    const updated = expenses.filter((item) => item.id !== expense.id);
    setExpenses(updated);
    handleClose();
  }

  useEffect(() => {
    if (!changedCountry.current) {
      return;
    }
    if (countries[selectedCountry] === AppOptions.baseCurrency) {
      updateExpense({ country: selectedCountry, currency: countries[selectedCountry], rate: 1, convertedPrice: price})
    }
    const convertCurrency = async () => {
        const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${AppOptions.baseCurrency}.json`);
        const json = await response.json();
        const data = json[AppOptions.baseCurrency];
        setRates(data);
        let newRate = data[countries[selectedCountry]];
        setRate(newRate);
        updateExpense({ convertedPrice: (price/newRate), rate: newRate, country: selectedCountry, currency: countries[selectedCountry] })
      }
    if (!rates) {
      convertCurrency();
      return
    }
    let newRate = rates[countries[selectedCountry]];
    updateExpense({ convertedPrice: (price/newRate), rate: newRate, country: selectedCountry, currency: countries[selectedCountry] });
      }, [selectedCountry])


  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    changedCountry.current = true;
  }

  const handleNoteChange = (e)  => {
    setNote(e.target.value);
    updateExpense({ note: e.target.value })
  }
  
  const categoryColor = categories.find(cat => cat.name === category).color;
  const filterColor = categories.find(cat => cat.name === category).filter;
  return (
    <div className={`expenses-container ${isClosing ? 'slide-out' : ''}`} onAnimationEnd={handleAnimationEnd}>
      <img src={icons["Back"]} className={`back-icon ${isClosing ? 'back-slide-out' : ''}`} onClick={handleClose} style={{filter: filterColor}}/>
      <div className='remove-container'>
        <span className='remove-button' onClick={handleRemove}>Delete</span>
      </div>
      <div className='top-container' style={{borderBottom: `1px solid ${categoryColor}`, backgroundColor: setAlpha(categoryColor, 0.129)}}>
        <div className='cat-container' style={{backgroundColor: categoryColor}}>
          <img src={icons[category]} className="cat-button" onClick={() => setIsCatOpen(true)} />
        </div>
        <input className="name-input" dir="rtl" value={name} onChange={handleTitleChange} placeholder={ogName.current} 
        style={{color: categoryColor}}/>
      </div>
      { !isNoteOpen &&
        <div className='note-icon-container' onClick={() => setIsNoteOpen(true)}>
        <span className='add-desc-text'>Add description</span>
        <img src={icons["Note"]} value='note' className='note-icon' style={{filter: filterColor}}/>
        <span className='invisible'>Add description</span>
      </div>
      }
      {isNoteOpen && 
        <div className='note-container'>
          <textarea className='note-detail' placeholder="Description" value={note} onChange={handleNoteChange}
          onFocus={() => setIsNoteFocused(true)} onBlur={() => setIsNoteFocused(false)}
          style={{boxShadow: isNoteFocused ? `0 0 10px ${setAlpha(categoryColor, 0.4)}` : 'none',
                  borderColor: isNoteFocused ? categoryColor : undefined}}
                  />
        </div>}
      <div className="price-container">
        <input className="price-input" value={price} onChange={handlePriceChange} placeholder={expense.price} />
        <div onClick={() => setIsCountryOpen(true)} className='currency-container' style={{backgroundColor: setAlpha(categoryColor, 0.25),
           border: `1px solid ${setAlpha(categoryColor, 0.5)}`}}>
          <div className='currency'>{expense.currency.toUpperCase()}</div>
          {AppOptions.baseCurrency != expense.currency && 
          <div className='rate'>{(1/expense.rate).toFixed(2)}{AppOptions.baseCurrency.toUpperCase()}</div>}
        </div>
        {isCountryOpen && <CountryModal setIsOpen={setIsCountryOpen} selectedCountry={selectedCountry} setSelectedCountry={(country) => handleCountryChange(country)} categoryColor={categoryColor}/>}
      </div>
      <div className='date-container'>
        <input className="date-input" type="date" value={selectedDate} onChange={handleDateChange}  />
      </div>
      <div>
        {isCatOpen && <CategoryModal setIsOpen={setIsCatOpen} setCategory={setCategory} onClose={updateCat}/>}
      </div>
    </div>
  );
};