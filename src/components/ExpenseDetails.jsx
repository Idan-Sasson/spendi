import { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import CategoryModal from './CategoryModal';
import CountryModal from './CountryModal';
import './ExpenseDetails.css';
import countries from "./countries.json"
import { AppOptions, icons} from './constants';
import { setIconColor, parseRgbaString, setAlpha, convertCategories } from './HelperFunctions';
import { useDeleteExpense } from './firebaseHooks/useDeleteExpense';
import { useUpdateExpense } from './firebaseHooks/useUpdateExpense';
import Calculator from './customs/Calculator';

export default function ExpenseDetails( {setIsOpen, expenseId, expenses, setExpenses} ) {
  const { deleteExpense } = useDeleteExpense();
  const { updateExpense: updateFirebaseExpense } = useUpdateExpense();  // Already have updateExpense
  const expense = expenses.find(exp => exp.expenseId === expenseId);
  const [lastRates, setLastRates] = useLocalStorage("lastRates" , []);
  const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);
  const [savedCategories, setSavedCategories] = useLocalStorage("savedCategories", []);
  const [lastCurrency, setLastCurrency] = useState(expense.currency);
  const ogName = useRef(expense.name);
  const [name, setName] = useState(expense.name);
  const [price, setPrice] = useState(String(expense.price));
  const [selectedDate, setSelectedDate] = useState(new Date(expense.date).toISOString().split('T')[0]);
  // const [saveDate, setSaveDate] = useState(expense.date);
  const [rate, setRate] = useState(expense.rate);
  const [category, setCategory] = useState(expense.category);
  const [selectedCountry, setSelectedCountry] = useState(expense.country);
  const [note, setNote] = useState(expense.note);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [rates, setRates] = useState("");
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isNoteFocused, setIsNoteFocused] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('');
  const [toDisplay, setToDisplay] = useState(false);
  const [toDelete, setToDelete] = useState(false);
  const [exclude, setExclude] = useState(expense.exclude);
  const [currency, setCurrency] = useState(expense.currency)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const getColor = (category) => {
    return savedCategories[category] || convertCategories()[category].color
  }

  const [categoryColor, setCategoryColor] = useState(getColor(expense.category));

  useEffect(() => {
    // if (categoryColor) {
    // const timer = setTimeout(() => {
      const meta = document.querySelector('meta[name="theme-color"]');
      meta.setAttribute('content', categoryColor);
    // }, 10);
    // return () => clearTimeout(timer);
      
    // }
  }, [categoryColor])

  useEffect(() => {
    if (note) setIsNoteOpen(true)
  }, []);

  const handleSave = () => {
    handleClose();

  }

  const updateExpense = (updatedField) => {
    const updatedExpenses = expenses.map(exp => {
      if (exp.expenseId === expense.expenseId) {
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


  const handlePriceChange = (e) => {
    const isValidNumber = str => /^-?\d*\.?\d*$/.test(str);
    const newPrice = Number(e.target.value);
    const pfPrice = parseFloat(newPrice); // ParsedFloat
    if (!isValidNumber(e.target.value)) return;
    // const newPrice = parseFloat(e.target.value);
    if (newPrice === '-') {
      setPrice("-");
    }
    else if (isNaN(pfPrice)) {
      setPrice("");
    }
    else {
    setPrice(e.target.value);
  }};

  const updateCat = (newCat) => {
    setCategory(newCat)
  }

  const handleClose = () => {
    setIsClosing(true);
  }

  const handleToggle = (setChange) => {
    setChange(t => !t);
  }

  const handleAnimationEnd = () => {
    if (isClosing) {
    if (toDelete) {
          if (expense.id) deleteExpense(expense.id) // Removes from firestore
      const updated = expenses.filter((item) => item.expenseId !== expense.expenseId);
      setExpenses(updated); // Deletes from local storage
      setIsOpen(false);
      return
    }

      setIsOpen(false);
          let newName = ''
    if (name === '') newName = ogName.current;
    else newName = name;
    let newPrice = Number(price);
    if (isNaN(price)) newPrice = 0;
    const updatedFields = { name: newName, price: newPrice, date: new Date(selectedDate).getTime(), category: category, convertedPrice: newPrice/rate, note: note, rate: rate, country: selectedCountry, currency, exclude: exclude || false }
    updateExpense(updatedFields);
    updateFirebaseExpense(updatedFields, expense.id);
    }
  }

  const handleRemove = () => {
    handleClose();
    setToDelete(true);
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);  // Shows the new date in the input
    // setSaveDate(new Date(newDate).getTime());
  };

  useEffect(() => {
    setLastCurrency(currency);
    if (currency === lastCurrency) {  // If it's a different country but same currency
      return;
    }
    if (currency === AppOptions.baseCurrency) { // If the country is the same as baseCurrency
      setRate(1);
      return;
    }
    const getRates = async () => {
      try {
        console.log("Fetching");
        const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${AppOptions.baseCurrency}.json`);
        if (!response.ok){ // No internet 
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRates(data);
        setLastRates(data); // Set the new fetched rates to save for next time failure
        setRate(data[AppOptions.baseCurrency][currency]);
        let newRate = data[AppOptions.baseCurrency][currency];
        setRate(newRate);
      }
      catch (error) {  // For any error with fetching the data, use the last saved rates
        console.error(error.message);
        console.log("Using last rates");
        setRate(lastRates[AppOptions.baseCurrency][currency])
        return
      }
    }
    // if (AppOptions.baseCurrency === countries[selectedCountry]) return;
    if (!rates) {
      getRates();
    }
    else {
      let newRate = rates[AppOptions.baseCurrency][currency];
      setRate(newRate);
    }
  }, [currency])


  useEffect(() => {  // Set new category color when we select a new category
    setCategoryColor(getColor(category));
  }, [category])

  const getIconSrc = (iconName, color)=> { // Checks if icon is cached, if not then change it's color and catch
    const cacheKey = `${iconName}-${color}`
    if (cachedIcons[cacheKey]) {
      return cachedIcons[cacheKey];
    }
    // If the icon is not catched
    async function iconsCach(iconName, colorStr) {
      const cacheKey = `${iconName}-${colorStr}`;
      const iconRgba = parseRgbaString(colorStr);
      const iconSrc = icons[iconName];
      const dataUrl = await setIconColor(iconSrc, iconRgba);
      setCachedIcons(prev => ({ ...prev, [cacheKey]: dataUrl }));
    }
    Promise.all(
    [[iconName, color]].map(([name, color]) => iconsCach(name, color)))
      
    return icons[iconName]
  }

    useEffect(() => {
    if (!isCalcOpen) {
      setCalcDisplay(price);
      setToDisplay(false);
    }
  }, [isCalcOpen])

  return (
    <div className={`expenses-container ${isClosing ? 'slide-out' : ''}`} onAnimationEnd={handleAnimationEnd} style={{backgroundColor: AppOptions["backgroundColor"]}}>
      <img src={getIconSrc("Back", getColor(category))} className={`back-icon ${isClosing ? 'back-slide-out' : ''}`} onClick={handleSave}/>
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
        <img src={getIconSrc("Note", getColor(category))} value='note' className='note-icon'/>
        <span className='invisible'>Add description</span>
      </div>}
      {isNoteOpen && 
        <div className='note-container'>
          <textarea className='note-detail' placeholder="Description" value={note} onChange={(e) => setNote(e.target.value)}
          onFocus={() => setIsNoteFocused(true)} onBlur={() => setIsNoteFocused(false)}
          style={{boxShadow: isNoteFocused ? `0 0 10px ${setAlpha(categoryColor, 0.4)}` : 'none',
                  borderColor: isNoteFocused ? categoryColor : undefined}}
                  />
        </div>}

      <div className="price-container">
        <div className='ed-calc-display-container' onClick={() => setIsCalcOpen(true)}>
        <input className='ed-calc-input' readOnly={true} value={calcDisplay || ''} placeholder={expense.price} style={{fontSize: toDisplay ? '15px' : '20px'}}/>
        <div className={`ed-calc-display ${toDisplay ? '' : 'hide'}`}>{price ? `= ${price}` : ''}</div>
        {/* <input className="price-input" value={price} onChange={handlePriceChange} placeholder={expense.price} /> */}
        </div>
        <div onClick={() => setIsCurrencyOpen(true)} className='currency-container' style={{backgroundColor: setAlpha(categoryColor, 0.25),
           border: `1px solid ${setAlpha(categoryColor, 0.5)}`}}>
          <div className='currency'>{currency.toUpperCase()}</div>
          {AppOptions.baseCurrency != currency && 
          <div className='rate'>{(1/rate).toFixed(2)}{AppOptions.baseCurrency.toUpperCase()}</div>}
        </div>
        {isCountryOpen && <CountryModal setIsOpen={setIsCountryOpen} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} categoryColor={categoryColor}/>}
        {isCurrencyOpen && <CountryModal setIsOpen={setIsCurrencyOpen} selectedCountry={currency} setSelectedCountry={setCurrency} categoryColor={categoryColor} type='currency'/>}
      </div>
      <div className="ed-country-container" dir='rtl' onClick={() => setIsCountryOpen(true)}>
        <div className="ed-country" style={{backgroundColor: setAlpha(categoryColor, 0.25), borderColor: setAlpha(categoryColor, 0.5)}}>{selectedCountry}</div>
      </div>
      <div className='date-container'>
          <input className="date-input-invisible" type="date" value={selectedDate} onChange={handleDateChange}  />

        <div className='ed-date-input-container'>
          <input className="date-input" type="date" value={selectedDate} onChange={handleDateChange}/>
        </div>
        <img src={getIconSrc("Calendar", getColor(category))} className="ed-calendar-icon"/>
      </div>

      {/* Exclude */}
      <div className='checkbox-container' onClick={() => handleToggle(setExclude)}>
        <span className="ed-exclude-metrics-text">Exclude from metrics</span>
        <input className='exclude-checkbox' type='checkbox' checked={exclude} style={{accentColor: categoryColor}} readOnly={true}/>
      </div>

      <div>
        {isCatOpen && <CategoryModal setIsOpen={setIsCatOpen} setCategory={setCategory} onClose={updateCat}/>}
        {isCalcOpen && <Calculator calc={calcDisplay} setCalc={setCalcDisplay} setResult={setPrice} setIsCalcOpen={setIsCalcOpen} setToDisplay={setToDisplay}/>}
        
      </div>
    </div>
  );
};