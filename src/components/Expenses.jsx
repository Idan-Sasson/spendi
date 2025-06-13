import { useLocalStorage } from "./useLocalStorage";
import "./Expenses.css";
import { useNavigate } from "react-router-dom";
import { icons, categoriesColors, categories } from "./constants";
import { setAlpha } from "./HelperFunctions";

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useLocalStorage("expenses", []);

  // Step 1: Group the expenses by date
  const groupedExpenses = expenses.reduce((result, item) => {
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

  // Function to remove an expense
  const handleRemove = (id) => {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
  };

  function getColorFilter(category) {
      return categories.find(cat => cat.name === category).filter;
  };
  return (
    <div className="expenses-body">
      <ul className="expense-list">
        {/* Go over each date group */}
        {Object.entries(groupedExpenses)
          .sort((a, b) => new Date(a[0]) - new Date(b[0]))
          .map(([isoDate, items]) => (
            <li key={isoDate}>
              <div className="date-header">
                <span className="total">
                  {" "}
                  ₪{items
                    .reduce((sum, item) => sum + item.price, 0)
                    .toFixed(2)}{" "}
                </span>
                <span className="date">{isoDate}</span>
              </div>
              <ul className="expenses">
                {/* For each item under the date, show its name and price */}
                {items.map((item) => (
                  <li key={item.id}>
                    <div
                      className="item-header"
                      key={item.id}
                      onClick={() => navigate(`/expense/${item.id}`)}
                    >
                      <span className="item-price">₪{item.price} </span>
                      <div className="item-actions">
                        <img src={icons[item.category]} className="item-icon"
                        style={{filter: getColorFilter(item.category)}}/>
                        <span className="item-name" >{item.name} </span>
                        <button
                          className="remove"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from bubbling up to the li
                            handleRemove(item.id);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Expenses;
