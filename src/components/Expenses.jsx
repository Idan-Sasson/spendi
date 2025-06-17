import { useLocalStorage } from "./useLocalStorage";
import "./Expenses.css";
import { icons, categories, AppOptions } from "./constants";
import { useState, useEffect } from "react";
import ExpenseDetails from "./ExpenseDetails";
import React from "react";
import AddButton from './AddButton';

const Expenses = () => {
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  const [openDetailId, setOpenDetailId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  function getColorFilter(category) {
      return categories.find(cat => cat.name === category).filter;
  };

  return (
    <div className="expenses-body">
      <AddButton  expenses={expenses} setExpenses={setExpenses}/>
      <ul className="expense-list">
        {/* Go over each date group */}
        {Object.entries(groupedExpenses)
          .map(([isoDate, items]) => (
            <li key={isoDate}>
              <div className={`date-header ${isoDate === Object.keys(groupedExpenses)[0] ? 'first' : ''}`}>
                <span className="total">₪{items.reduce((sum, item) => sum + item.convertedPrice, 0).toFixed(2)}{" "}
                </span>
                <span className="date">{isoDate}</span>
              </div>
              <ul key={isoDate} className="expenses">
                {/* For each item under the date, show its name and price */}
                {items.map((item) => (
                  <React.Fragment key={item.id}>
                  <li key={item.id}>
                    <div
                      className="item-header"
                      key={item.id}
                      onClick={() => {setOpenDetailId(item.id); setIsDetailOpen(true)}}
                    >
                      <div>
                        <span className="item-price">₪{Number(item.convertedPrice).toFixed(2)} </span>
                        {item.currency !== AppOptions.baseCurrency &&
                          <span className="real-currency">({item.price.toFixed(2)} {item.currency.toUpperCase()})</span>}
                      </div>
                      <div className="item-actions">
                        <span className="item-name" >{item.name} </span>
                        <img src={icons[item.category]} className="item-icon"
                          style={{filter: getColorFilter(item.category)}}/>
                          {item.note && <div className="is-note"/>}
                        {/* <button
                          className="remove"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from bubbling up to the li
                            handleRemove(item.id);
                          }}
                        >
                          🗑️
                        </button> */}
                      </div>
                    </div>
                  </li>
                  {isDetailOpen && openDetailId === item.id && <ExpenseDetails setIsOpen={setIsDetailOpen} expenseId={openDetailId} expenses={expenses} setExpenses={setExpenses}/>}
                  </React.Fragment>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Expenses;
