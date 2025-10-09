import { useEffect, useRef, useState } from "react";
import './AddExpenseModal.css'
import CategoryModal from "./CategoryModal";
import { categories, icons, AppOptions } from './constants';
import { convertCategories, setAlpha } from "./HelperFunctions";
import countries from "./countries.json"
import CountryModal from "./CountryModal";
import { useLocalStorage } from "./useLocalStorage";
import { setIconColor, parseRgbaString } from "./HelperFunctions";
import { useAddExpense } from "./firebaseHooks/useAddExpense";
import { useGetUserInfo } from "./firebaseHooks/useGetUserInfo";
import Calculator from "./customs/Calculator";
import SecondaryCategory from "./SecondaryCategory";
import Warning from "./customs/Warning";


export default function AddExpenseModal({ setIsOpen, expenses, setExpenses }) {
  const { userID } = useGetUserInfo();
  const [savedCategories, setSavedCategories] = useLocalStorage("savedCategories", []);
  const [modalExpense, setModalExpense] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(Date.now());
  const [lastRates, setLastRates] = useLocalStorage("lastRates" , []);
  const [category, setCategory] = useState("General");
  const [isClosing, setIsClosing] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [country, setCountry] = useState("Israel");
  const [rate, setRate] = useState(null);
  const [rates, setRates] = useState(null);
  const [note, setNote] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isNoteFocused, setIsNoteFocused] = useState(false);
  const [calendarIcon, setCalendarIcon] = useState(icons["Calendar"]);
  const [plusIcon, setPlusIcon] = useState(icons["Plus"]);
  const { addExpense } = useAddExpense(expenses, setExpenses);
  const [ipCountry, setIpCountry] = useLocalStorage('ipCountry', '');
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('');
  const [toDisplay, setToDisplay] = useState(false);
  const [exclude, setExclude] = useState(false);
  const [currency, setCurrency] = useState("ils")
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [secondaryCat, setSecondaryCat] = useState("")
  const [isPriceEmpty, setIsPriceEmpty] = useState(false);  // If user tries to submit when price is empty, colors the placeholder to red
  const [isCloseWarningOpen, setIsCloseWarningOpen] = useState(false);  // Sets a warning if user clicks on the overlay in order to close
  const [selectedWarningClick, setSelectedWarningClick] = useState('');

  
  useEffect(() => {  // On start set country by ipCountry
    if (Object.hasOwn(countries, ipCountry)) {
      setCountry(ipCountry);
      setCurrency(countries[ipCountry])
    } 
  }, [])

  const handleModalSubmit = async () => {
    // if (String(modalExpense).trim() === "" )  // Blank name - renames to category name
    // if (String(modalPrice).trim() === "") {
    //   setIsPriceEmpty(true);
    //   return;
    // }; // Blank price check
    console.log(parseFloat(modalPrice) || 0);
    handleClose();

   const tmpRate = rate || 1;
    const convertedPrice = parseFloat(modalPrice) / tmpRate;

    const expenseData = {
      name: modalExpense || category,  // Renames to category's name if blank
      price: parseFloat(modalPrice) || 0,
      date: selectedDate, // keep this if you're intentionally overriding current time
      category,
      currency,
      convertedPrice: parseFloat(convertedPrice) || 0,
      country,
      rate: tmpRate,
      note, 
      expenseId: new Date().getTime(),
      exclude,
      userID,
      secondaryCat,
    };

    // Update localStorage
    const updatedExpenses = [...expenses, { ...expenseData}]
    setExpenses(updatedExpenses);
    // Update firebase and get firebase's ID
    const fbId = await addExpense(expenseData);
      if (fbId) {
        const patched = updatedExpenses.map(exp =>
        exp.expenseId === expenseData.expenseId ? { ...exp, id: fbId } : exp
      );
      setExpenses(patched); 
      }
  };

  useEffect(() => {
    const getRates = async () => {
      try {
        const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${AppOptions.baseCurrency}.json`);
        if (!response.ok){ // No internet 
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRates(data);
        setLastRates(data)
        setRate(data[AppOptions.baseCurrency][currency]);
      }
      catch (error) {
        console.error(error.message);
        // setRates(lastRates);
        console.log("Using last rates");
        setRate(lastRates[AppOptions.baseCurrency][currency])
        return
      }

    }
    if (AppOptions.baseCurrency === currency) {  // resets rate to 1 if resets to baseCurrency
      setRate(1);
      return
    };
    if (!rates) {
      getRates();
    }
    else {
      setRate(rates[AppOptions.baseCurrency][currency])
    }
  }, [currency])

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsOpen(false);
    }
  };

  const getColor = (category) => {
      return savedCategories[category] || convertCategories()[category].color
  }

  const categoryColor = getColor(category);

  useEffect(() => {
    // setCategoryFilter(categories.find(cat => cat.name === category).filter);
    setIconColor(icons["Calendar"], parseRgbaString(categoryColor)).then(setCalendarIcon);
  }, [category])

  useEffect(() => {
    if (!isCalcOpen) {
      setCalcDisplay(modalPrice);
      setToDisplay(false);
    }
  }, [isCalcOpen])

  useEffect(() => {
    if (!modalPrice) setModalPrice('');
  }, [modalPrice])

  useEffect(() => {
    if (selectedWarningClick.trim() === "Leave") {
      handleClose();
      return;
    }
  }, [selectedWarningClick])

  const handleToggle = (setChange) => {
    setChange(t => !t);
  }

  const closeWarning = () => {
    if (!modalExpense && !modalPrice && !note) {
      handleClose();  // Closes if user didn't fill anything important
      return;
    }
      setIsCloseWarningOpen(true);
  }

  return (
    <div>
          {isCloseWarningOpen && <Warning warning="Leave without saving?" options={["Back", "Leave"]} setSelected={setSelectedWarningClick} setOpen={setIsCloseWarningOpen} />}
          {isCalcOpen && <Calculator calc={calcDisplay} setCalc={setCalcDisplay} setResult={setModalPrice} setIsCalcOpen={setIsCalcOpen} setToDisplay={setToDisplay}/>}
    <div className={`modal-overlay ${isClosing ? 'blur-out' : ''}`} onClick={closeWarning}>

      <div className={`modal-container ${isClosing ? 'fade-out' : ''}`} onClick={(e) => e.stopPropagation()} onAnimationEnd={handleAnimationEnd} style={{boxShadow: `0 0 32px 0 ${setAlpha(categoryColor, 0.2)}`}}>

        <div className='modal-bg-image' style={{ backgroundImage: `url(${icons[category]})` }} />
        
          <input className="new-expense-input"
            value={modalExpense}
            onChange={(e) => setModalExpense(e.target.value)}
            placeholder="Expense"
            dir='rtl'/>
          <div className="price-container-container">
            {/* <CurrencyModal selectedCurrency={currency} setSelectedCurrency={setCurrency}/> */}
          <div className="price-container">
            <div className="aem-currency-container" style={{backgroundColor: setAlpha(categoryColor, 0.5), borderColor: categoryColor}} onClick={() => setIsCurrencyOpen(true)}>
              <div className="aem-base-currency">{currency.toUpperCase()}</div>
              {currency.toLowerCase() !== AppOptions.baseCurrency.toLowerCase() && 
              <div className="aem-convert-rate">{rate ? `${(1/rate).toFixed(2)}${AppOptions.baseCurrency.toUpperCase()}` : '0'}</div>}
            </div>
            
            <div className="aem-prices-container" onClick={() => setIsCalcOpen(true)}>
              <input className="aem-price-input"
                readOnly={true}
                value={calcDisplay || ''}
                placeholder="0.00"/>
              <div className={`aem-calc-display ${toDisplay ? '' : 'hide'}`}>{modalPrice ? `= ${modalPrice}` : ''}</div>
            </div>
          </div>
          </div>
          <div>
            <div className='open-cat-container' onClick={() => setIsCatOpen(true)} style={{backgroundColor: setAlpha(categoryColor, 0.5)}}>
              <img src={icons[category]} className="open-cat" />
            </div>

            <div className="aem-country-wrapper">
              <span className="aem-country-select" onClick={() => setIsCountryOpen(true)} style={{backgroundColor: setAlpha(categoryColor, 0.5), borderColor: categoryColor}}>{country}</span>
            </div>
          </div>

          <div className="aem-datepicker">
            <img src={calendarIcon} className="aem-calendar-icon"/>
            <input type="date" value={new Date(selectedDate).toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value).getTime())} dir='rtl' className="aem-date-input" />
          </div>

          <textarea className='note' placeholder="Description" onChange={(e) => setNote(e.target.value)}
            onFocus={() => setIsNoteFocused(true)} onBlur={() => setIsNoteFocused(false)}
            style={{boxShadow: isNoteFocused ? `0 0 10px ${setAlpha(categoryColor, 0.4)}` : 'none',
            borderColor: isNoteFocused ? categoryColor : undefined}}
            />
          <div onClick={() => handleToggle(setExclude)}>
          <input className='aem-exclude-checkbox' type='checkbox' checked={exclude} style={{accentColor: categoryColor}} readOnly={true}/>
            <span className="exclude-metrics-text"> Exclude from metrics</span>
          </div>
          <div>
            <SecondaryCategory setStrCat={setSecondaryCat} classPrefix="aem-sec-selector" />
          </div>

          <div>
            {isCatOpen && <CategoryModal setIsOpen={setIsCatOpen} setCategory={setCategory}/>}
          {isCountryOpen && <CountryModal setIsOpen={setIsCountryOpen} selectedCountry={country} setSelectedCountry={setCountry} categoryColor={categoryColor} wrapperPosition={{top: '45%', right: '15%', height: '40vh', transformOrigin: 'top left'}} isPortal={true} type={'country'}/>}
          {isCurrencyOpen && <CountryModal setIsOpen={setIsCurrencyOpen} selectedCountry={currency} setSelectedCountry={setCurrency} categoryColor={categoryColor} wrapperPosition={{transformOrigin: 'top left'}}  type={'currency'}/>}
          </div>

          <img src={icons["Plus"]} className={`add-button ${isClosing ? 'spin' : ''}`} onClick={handleModalSubmit} style={{backgroundColor: categoryColor}}/>
          <button className="close-button" onClick={handleClose}>X</button>
      </div>
    </div>
    </div>
  );
}
