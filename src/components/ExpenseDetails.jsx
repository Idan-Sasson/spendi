import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import CategoryModal from './CategoryModal';
import CountryModal from './CountryModal';
import './ExpenseDetails.css';
import countries from "./countries.json"
import { AppOptions, icons, categories} from './constants';
import { setIconColor, parseRgbaString, setAlpha } from './HelperFunctions';


export default function ExpenseDetails( {setIsOpen, expenseId, expenses, setExpenses} ) {
  // const [expenses, setExpenses] = useLocalStorage('expenses', []);
  // const { id } = useParams();
  const expense = expenses.find(exp => exp.id === Number(expenseId));
  
  const [lastRates, setLastRates] = useLocalStorage("lastRates" , []);
  const [lastCountry, setLastCountry] = useState(expense.country);
  const ogName = useRef(expense.name);
  const [name, setName] = useState(expense.name);
  const [price, setPrice] = useState(expense.price);
  const [selectedDate, setSelectedDate] = useState(new Date(expense.date).toISOString().split('T')[0]);
  const [rate, setRate] = useState(expense.rate);
  const [category, setCategory] = useState(expense.category);
  const [convertedPrice, setConvertedPrice] = useState(expense.converted)
  const [selectedCountry, setSelectedCountry] = useState(expense.country);
  const [note, setNote] = useState(expense.note);
  const [currency, setCurrency] = useState(expense.currency);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const changedCountry = useRef(false);
  const [rates, setRates] = useState("");
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isNoteFocused, setIsNoteFocused] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false)
  const [backIconSrc, setBackIconSrc] = useState(icons["Back"]);
  const [calendarIcon, setCalendarIcon] = useState(icons["Calendar"]);
  const [noteIcon, setNoteIcon] = useState(icons["Note"]);

// if (!expense) return <div>Expense not found</div>;

  useEffect(() => {
    if (note) setIsNoteOpen(true)
  }, []);

  const handleSave = () => {
    handleClose();
    let newName = ''
    if (name === '') newName = ogName.current;
    else newName = name;
    updateExpense({ name: newName, price: price, date: selectedDate, category: category, convertedPrice: price/rate, note: note, rate: rate, country: selectedCountry, currency: countries[selectedCountry] })

  }

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
  if (!category) {
    setCategory("General");
    updateExpense({ category: "General" });
  }
}, []); // Runs only once on mount

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);  // Shows the new date in the input  
    // updateExpense({ date: new Date(newDate).getTime() });
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
    const pfPrice = parseFloat(newPrice); // ParsedFloat
    if (!isValidNumber(e.target.value)) return;
    // const newPrice = parseFloat(e.target.value);
    if (newPrice === '-') {
      setPrice("-");
      setConvertedPrice(0);
      // updateExpense({ price: 0, convertedPrice: 0 });
    }
    else if (isNaN(pfPrice)) {
    //   console.log("nan")
      setPrice("");
      setConvertedPrice(0);
      // updateExpense({ price: 0, convertedPrice: 0 });
    }
    else {
    setPrice(pfPrice);
    setConvertedPrice(pfPrice / rate);
    // updateExpense({ price: plPrice, convertedPrice: (plPrice / rate) });
  }};

  const updateCat = (newCat) => {
    setCategory(newCat)
    // updateExpense({ category: newCat })
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
    if (!changedCountry.current) return;
    setLastCountry(selectedCountry);
    if (countries[selectedCountry] === countries[lastCountry]) {  // If it's a different country but same currency
      // updateExpense({ country: selectedCountry });
      return;
    }
    if (countries[selectedCountry] === AppOptions.baseCurrency) {
      setRate(1);
      setConvertedPrice(price);
      // updateExpense({ country: selectedCountry, currency: countries[selectedCountry], rate: 1, convertedPrice: price});
      return;
    }
    const getRates = async () => {
      try {
        const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${AppOptions.baseCurrency}.json`);
        if (!response.ok){ // No internet 
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRates(data);
        setLastRates(data); // Set the new fetched rates to save for next time failure
        setRate(data[AppOptions.baseCurrency][countries[selectedCountry]]);
        let newRate = data[AppOptions.baseCurrency][countries[selectedCountry]];
        setConvertedPrice(price/newRate);
        setRate(newRate);
        // updateExpense({ convertedPrice: (price/newRate), rate: newRate, country: selectedCountry, currency: countries[selectedCountry] })
      }
      catch (error) {  // For any error with fetching the data, use the last saved rates
        console.error(error.message);
        console.log("Using last rates");
        setRate(lastRates[AppOptions.baseCurrency][countries[selectedCountry]])
        return
      }
    }
    // if (AppOptions.baseCurrency === countries[selectedCountry]) return;
    if (!rates) {
      getRates();
    }
    else {
      let newRate = rates[AppOptions.baseCurrency][countries[selectedCountry]];
      setConvertedPrice(price/newRate);
      setRate(newRate);
      // updateExpense({ convertedPrice: (price/newRate), rate: newRate, country: selectedCountry, currency: countries[selectedCountry] });
    }
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
 
  useEffect(() => {
    setIconColor(icons["Back"], parseRgbaString(categoryColor)).then(setBackIconSrc);
    setIconColor(icons["Calendar"], parseRgbaString(categoryColor)).then(setCalendarIcon);
    setIconColor(icons["Note"], parseRgbaString(categoryColor)).then(setNoteIcon);


  }, [category])


  return (
    <div className={`expenses-container ${isClosing ? 'slide-out' : ''}`} onAnimationEnd={handleAnimationEnd}>
      <img src={backIconSrc} className={`back-icon ${isClosing ? 'back-slide-out' : ''}`} onClick={handleSave}/>
      <div className='remove-container'>
        <span className='remove-button' onClick={handleRemove}>Delete</span>
      </div>
      <div className='top-container' style={{borderBottom: `1px solid ${categoryColor}`, backgroundColor: setAlpha(categoryColor, 0.129)}}>
        <div className='cat-container' style={{backgroundColor: categoryColor}}>
          <img src={icons[category]} className="cat-button" onClick={() => setIsCatOpen(true)} />
        </div>
        {/* <input className="name-input" dir="rtl" value={name} onChange={handleTitleChange} placeholder={ogName.current}  */}
        <input className="name-input" dir="rtl" value={name} onChange={(e) => setName(e.target.value)} placeholder={ogName.current} 
        style={{color: categoryColor}}/>
      </div>
      { !isNoteOpen &&
        <div className='note-icon-container' onClick={() => setIsNoteOpen(true)}>
        <span className='add-desc-text'>Add description</span>
        <img src={noteIcon} value='note' className='note-icon'/>
        <span className='invisible'>Add description</span>
      </div>
      }
      {isNoteOpen && 
        <div className='note-container'>
          {/* <textarea className='note-detail' placeholder="Description" value={note} onChange={handleNoteChange} */}
          <textarea className='note-detail' placeholder="Description" value={note} onChange={(e) => setNote(e.target.value)}
          onFocus={() => setIsNoteFocused(true)} onBlur={() => setIsNoteFocused(false)}
          style={{boxShadow: isNoteFocused ? `0 0 10px ${setAlpha(categoryColor, 0.4)}` : 'none',
                  borderColor: isNoteFocused ? categoryColor : undefined}}
                  />
        </div>}
      <div className="price-container">
        <input className="price-input" value={price} onChange={handlePriceChange} placeholder={expense.price} />
        <div onClick={() => setIsCountryOpen(true)} className='currency-container' style={{backgroundColor: setAlpha(categoryColor, 0.25),
           border: `1px solid ${setAlpha(categoryColor, 0.5)}`}}>
          <div className='currency'>{countries[selectedCountry].toUpperCase()}</div>
          {AppOptions.baseCurrency != countries[selectedCountry] && 
          <div className='rate'>{(1/rate).toFixed(2)}{AppOptions.baseCurrency.toUpperCase()}</div>}
        </div>
        {isCountryOpen && <CountryModal setIsOpen={setIsCountryOpen} selectedCountry={selectedCountry} setSelectedCountry={(country) => handleCountryChange(country)} categoryColor={categoryColor}/>}
      </div>
      <div className='date-container'>
          <input className="date-input-invisible" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}  />

        <div className='ed-date-input-container'>
          <input className="date-input" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}  />
          {/* <div className='invisible'>aaaaaa</div> */}
        </div>
        <img src={calendarIcon} className="ed-calendar-icon"/>

      </div>
      <div>
        {isCatOpen && <CategoryModal setIsOpen={setIsCatOpen} setCategory={setCategory} onClose={updateCat}/>}
      </div>
    </div>
  );
};