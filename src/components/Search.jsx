import { useEffect, useRef, useState } from "react";
import './Search.css'
import { useLocalStorage } from "./useLocalStorage";
import { useParams } from "react-router-dom";
import { AppOptions, categories, icons } from "./constants";
import { setIconColor, parseRgbaString, convertCategories, useBaseCurrency, getSymbol, useAllSecondaryCats } from "./HelperFunctions";
import AddButton from "./AddButton";
import ExpenseDetails from "./ExpenseDetails";
import CustomSelect from "./customs/CustomSelect";
import CountryModal2 from "./CountryModal2";
import CustomSelect2 from "./CustomSelect2";

export default function Search() {
  const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);
  const [savedCategories, setSavedCategories] = useLocalStorage("savedCategories", []);
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [openDetailId, setOpenDetailId] = useState('');
  const [search, setSearch] = useState('');
  const baseCurrency = useBaseCurrency();
  const curSymbol = getSymbol(baseCurrency);
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const selectRef = useRef(null);
  const [selectedSecCat, setSelectedSecCat] = useState([])
  const allSecCats = useAllSecondaryCats();

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    meta.setAttribute('content', "rgb(239, 240, 239)")
  }, [isDetailOpen])

  useEffect(() => {
	if (expenses.length === 0) setIsEmpty(true);
	else setIsEmpty(false);
  }, [expenses])

  let { category } = useParams();

	useEffect(() => {
		if (!categories.some(c => c.name === category)) {
			setSelectedCategory("All");
		}
		else {
			setSelectedCategory(category);
		}
	}, []);

  const getColor = (category) => {  // Gets color as rgb either from localStorage or from hard-coded
	  return savedCategories[category] || convertCategories()[category].color
  }

  const getGroupedLength = (grouped) => {  // Get the length of the grouped object
	return Object.values(grouped) // get all arrays (values)
  	.reduce((sum, arr) => sum + arr.length, 0); // sum up their lengths
  }

  useEffect(() => {  // Category Filter
	  setFilteredExpenses((selectedCategory.toLowerCase() === "all" ? expenses : expenses.filter(item => item.category === selectedCategory))  // Filter categories
	  .filter(item => search === '' || item.name.toLowerCase().includes(search.toLowerCase()))  // Filter search
	  .filter(item => selectedCountries.length === 0 || selectedCountries.includes(item.country))  // Filter countries
	  .filter(item => selectedSecCat.length === 0 || selectedSecCat.includes(item.secondaryCat)));  // Filter second category
  }, [selectedCategory, selectedCountries, search, expenses, selectedSecCat])

	const groupedExpenses = filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).reduce((result, item) => {
		const isoDate = new Date(item.date).toISOString().split('T')[0];
		if (!result[isoDate]) {
			result[isoDate] = []
		}
		result[isoDate].push(item);
		return result;
	}, {});

  useEffect(() => {  // Colors icons
    const isAllColored = () => {
    return categories.map(cat => {
      const cacheKey = `${cat.name}-${getColor(cat.name)}`;
      if (cachedIcons[cacheKey]) return false
      return [cat.name, getColor(cat.name)];
    })};
    let toColor = isAllColored()
    if (toColor.every(item => item !== false)) {
    
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
    const color = getColor(category)
    const cacheKey = `${category}-${color}`
    if (cachedIcons[cacheKey]) {
      return cachedIcons[cacheKey];
    }
    return icons[category]
  }
  
  const onOpen = () => {
    selectRef.current.style.overflowY = 'visible';
  }

  const onClose = () => {
    selectRef.current.style.overflowY = 'hidden';
    selectRef.current.scrollLeft = 0;
  }

	return (
		<div className={`s-overlay ${getGroupedLength(groupedExpenses) > 15 ? '' : 'add-padding'}`}>
			{isEmpty && 
        	<div className="empty-expenses-container">
        	  <span>Looks kinda empty, try adding a new expense by clicking on that red</span>
        	  <span className="text-plus"> +</span>
        	  <span> on the bottom.</span>
        	</div>
      		}
			<AddButton expenses={expenses} setExpenses={setExpenses}/>
			<div className="s-options-header" ref={selectRef}>
				<CustomSelect onSelect={val => setSelectedCategory(val)} optionTitle={selectedCategory} style={{boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)', paddingBottom: '1px'}} onClose={onClose} onOpen={onOpen} className="s-cat-dropdown-container">
          <div data-value="All" className="s-option-container">
						<img className="s-filter-icon" src={icons["All"]} />
						<div key={"All"}>All</div>
					</div>
					{categories.map((cat) => (
						<div key={cat.name} data-value={cat.name} className="s-option-container">
							<img className="s-filter-icon" src={getIconSrc(cat.name)} />
							<div>{cat.name}</div>
						</div>
					))}
				</CustomSelect>
				<input className='search-input' onChange={(e) => setSearch(e.target.value)} placeholder="Search"/>
				<CountryModal2 selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} className={"search-filter-countries"}/>
				<CustomSelect2 items={allSecCats} selected={selectedSecCat} setSelected={setSelectedSecCat} className={"search-filter-countries"}/>
			</div>

			{Object.entries(groupedExpenses).map(([isoDate, items]) => (
				<div key={isoDate}>
					<div className="date-header">
						<span className="total">
							{curSymbol}{items.reduce((sum, expense) => sum + expense.convertedPrice, 0).toFixed(2)}{" "}
						</span>
						<span>{isoDate}</span>
					</div>
					{items.map((expense) => (
						<div className='item-header' key={expense.expenseId} onClick={() => {setIsDetailOpen(true); setOpenDetailId(expense.expenseId)}}>
							<div className="s-price-container">
                        	<span className="item-price" style={{color: expense.exclude ? 'rgb(255, 68, 68)' : ''}}>{expense.exclude && '('}{curSymbol}{Number(expense.convertedPrice).toFixed(2)}{expense.exclude && ')'}</span>
								{ expense.currency !== baseCurrency &&
								<span className="real-currency">({expense.price.toFixed(2)} {expense.currency.toUpperCase()})</span>
								}
							</div>
							<div className="item-actions">
								<div className="expense-name-container">
									<div className="expense-name-text">{expense.name}</div>
									{expense.secondaryCat && <div className="s-sec-cat-text">({expense.secondaryCat})</div>}
								</div>
								<img className='item-icon' src={getIconSrc(expense.category)}/>
								{expense.note && <div className="is-note"/>}
							</div>
								{isDetailOpen && openDetailId === expense.expenseId && <ExpenseDetails setIsOpen={setIsDetailOpen} expenseId={openDetailId} expenses={expenses} setExpenses={setExpenses}/>}

						</div>
					))}
				</div>
			))}
		</div>
	)
}