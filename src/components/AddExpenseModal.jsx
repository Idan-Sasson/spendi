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
import { UNSAFE_useFogOFWarDiscovery } from "react-router-dom";


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
  const { addExpense } = useAddExpense(expenses, setExpenses);
  const hasMount = useRef(false);
  const [ipCountry, setIpCountry] = useLocalStorage('ipCountry', '')

  useEffect(() => {
    if (Object.hasOwn(countries, ipCountry)) setCountry(ipCountry);
  }, [])

  const handleModalSubmit = async () => {
    if (modalExpense.trim() === "" || modalPrice.trim() === "") return; // Blank input check
    handleClose();

   const tmpRate = rate || 1;
  const convertedPrice = parseFloat(modalPrice) / tmpRate;

  const expenseData = {
    name: modalExpense,
    price: parseFloat(modalPrice),
    date: selectedDate, // keep this if you're intentionally overriding current time
    category,
    currency: countries[country],
    convertedPrice: parseFloat(convertedPrice),
    country,
    rate: tmpRate,
    note, 
    expenseId: new Date().getTime(),
    userID,
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
        setRate(data[AppOptions.baseCurrency][countries[country]]);
      }
      catch (error) {
        console.error(error.message);
        // setRates(lastRates);
        console.log("Using last rates");
        setRate(lastRates[AppOptions.baseCurrency][countries[country]])
        return
      }

    }
    if (AppOptions.baseCurrency === countries[country]) return;
    if (!rates) {
      getRates();
    }
    else {
      setRate(rates[AppOptions.baseCurrency][countries[country]])
    }
  }, [country])

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsOpen(false);
    }
  };

  const handlePriceChange = (e) => {
    // console.log(typeof())
    const isValidNumber = str => /^-?\d*\.?\d*$/.test(str);
    if (!isValidNumber(e.target.value)) return;
    setModalPrice(e.target.value)
  }

  const getColor = (category) => {
      return savedCategories[category] || convertCategories()[category].color
  }

  const categoryColor = getColor(category);

  useEffect(() => {
    // setCategoryFilter(categories.find(cat => cat.name === category).filter);
    setIconColor(icons["Calendar"], parseRgbaString(categoryColor)).then(setCalendarIcon)

  }, [category])



  return (
    <div className={'modal-overlay'} onClick={handleClose}>

      <div className={`modal-container ${isClosing ? 'fade-out' : ''}`} onClick={(e) => e.stopPropagation()} onAnimationEnd={handleAnimationEnd} style={{boxShadow: `0 0 32px 0 ${setAlpha(categoryColor, 0.2)}`}}>

        <div className='modal-bg-image' style={{ backgroundImage: `url(${icons[category]})` }} />
        
          <input className="new-expense-input"
            value={modalExpense}
            onChange={(e) => setModalExpense(e.target.value)}
            placeholder="Expense"
            dir='rtl'
          />

          <div className="price-container">
            <div className="aem-currency-container" style={{backgroundColor: setAlpha(categoryColor, 0.5), borderColor: categoryColor}} onClick={() => setIsCountryOpen(true)}>
              <div className="aem-base-currency">{countries[country].toUpperCase()}</div>
              {countries[country] !== AppOptions.baseCurrency && 
              <div className="aem-convert-rate">{rate ? `${(1/rate).toFixed(2)}${AppOptions.baseCurrency.toUpperCase()}` : '0'}</div>}
            </div>
            <input className="new-price-input"
              // type='number'
              value={modalPrice}
              onChange={handlePriceChange}
              placeholder="0.00" />
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

          <div>
            {isCatOpen && <CategoryModal setIsOpen={setIsCatOpen} setCategory={setCategory}/>}
          {isCountryOpen && <CountryModal setIsOpen={setIsCountryOpen} selectedCountry={country} setSelectedCountry={setCountry} categoryColor={categoryColor} wrapperPosition={{top: '45%', right: '15%', height: '40vh', transformOrigin: 'top left'}} isPortal={true}/>}
          </div>

          <img src={icons["Plus"]} className={`add-button ${isClosing ? 'spin' : ''}`} onClick={handleModalSubmit}/>
          <button className="close-button" onClick={handleClose}>X</button>
      </div>
    </div>
  );
}
