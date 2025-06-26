import { useLocalStorage } from "./useLocalStorage";
import "./Expenses.css";
import { icons, categories, AppOptions } from "./constants";
import { useState, useEffect } from "react";
import { setIconColor, parseRgbaString, convertCategories, useBaseCurrency, getSymbol } from "./HelperFunctions";
import ExpenseDetails from "./ExpenseDetails";
import React from "react";
import AddButton from './AddButton';
 
const Expenses = () => {
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  const [savedCategories, setSavedCategories] = useLocalStorage("savedCategories", []);
  const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);
  const [openDetailId, setOpenDetailId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const baseCurrency = useBaseCurrency();
  const curSymbol = getSymbol(baseCurrency);

  useEffect(() => {
    document.body.style.overflow = isDetailOpen ? "hidden" : "";
  }, [isDetailOpen])

  // Step 1: Group the expenses by date
  const groupedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).reduce((result, item) => {
    // Turn the date into something like "12.12.24"
    const isoDate = new Date(item.date).toISOString().split("T")[0];
    // If this date doesn't exist in our groups yet, create an empty list
    if (!result[isoDate]) {
      result[isoDate] = [];
    }
    // Add the item into the correct date group
    result[isoDate].push(item);
    return result;
  }, {});

  const getColor = (category) => {
      return savedCategories[category] || convertCategories()[category].color
  }

  useEffect(() => {
    const isAllColored = () => {
    return categories.map(cat => {
      const cacheKey = `${cat.name}-${getColor(cat.name)}`;
      if (cachedIcons[cacheKey]) return false
      return [cat.name, getColor(cat.name)];
    })};
    let toColor = isAllColored()
    if (toColor.every(item => item === false)) {
    }
    else {
      async function iconsCach(iconName, colorStr) {
        const cacheKey = `${iconName}-${colorStr}`;
        const iconRgba = parseRgbaString(colorStr);
        const iconSrc = icons[iconName];
        const dataUrl = await setIconColor(iconSrc, iconRgba);
        setCachedIcons(prev => ({ ...prev, [cacheKey]: dataUrl }));
      }
      toColor = toColor.filter(val => val !== false);
      Promise.all(
      toColor.map(([name, color]) => iconsCach(name, color)))
    }
  }, [])

  const getIconSrc = (category) => {
    const color = getColor(category);
    const cacheKey = `${category}-${color}`
    if (cachedIcons[cacheKey]) {
      return cachedIcons[cacheKey];
    }
    return icons[category]
  }

  return (
    <div className="expenses-body">
      <AddButton  expenses={expenses} setExpenses={setExpenses}/>
      <ul className="expense-list">
        {/* Go over each date group */}
        {Object.entries(groupedExpenses)
          .map(([isoDate, items]) => (
            <div key={isoDate}>
              <div className={`date-header ${isoDate === Object.keys(groupedExpenses)[0] ? 'first' : ''}`}>
                <span className="total">{curSymbol}{items.reduce((sum, item) => sum + item.convertedPrice, 0).toFixed(2)}{" "}
                </span>
                <span className="date">{isoDate}</span>
              </div>
              <ul key={isoDate} className="expenses">
                {/* For each item under the date, show its name and price */}
                {items.map((item) => (
                  <React.Fragment key={item.expenseId}>
                  <div key={item.expenseId}>
                    <div
                      className="item-header"
                      key={item.expenseId}
                      onClick={() => {setOpenDetailId(item.expenseId); setIsDetailOpen(true)}}
                    >
                      <div>
                        <span className="item-price">{curSymbol}{Number(item.convertedPrice).toFixed(2)} </span>
                        {item.currency !== baseCurrency &&
                          <span className="real-currency">({item.price.toFixed(2)} {item.currency.toUpperCase()})</span>}
                      </div>
                      <div className="item-actions">
                        <span className="item-name" >{item.name} </span>
                        <img src={getIconSrc(item.category)} className="item-icon"/>
                          {item.note && <div className="is-note"/>}
                      </div>
                    </div>
                  </div>
                  {isDetailOpen && openDetailId === item.expenseId && <ExpenseDetails setIsOpen={setIsDetailOpen} expenseId={openDetailId} expenses={expenses} setExpenses={setExpenses}/>}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          ))}
      </ul>
    </div>
  );
};

export default Expenses;
