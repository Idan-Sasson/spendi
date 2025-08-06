import { useEffect, useRef, useState } from "react";
import './Search.css'
import { useLocalStorage } from "./useLocalStorage";
import { useParams } from "react-router-dom";
import { AppOptions, categories, icons } from "./constants";
import { setIconColor, parseRgbaString, convertCategories, useBaseCurrency, getSymbol } from "./HelperFunctions";
import AddButton from "./AddButton";
import ExpenseDetails from "./ExpenseDetails";
import CustomSelect from "./customs/CustomSelect";
import CountryModal2 from "./CountryModal2";

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

  const getColor = (category) => {
	  return savedCategories[category] || convertCategories()[category].color
  }
  useEffect(() => {
	  setFilteredExpenses((selectedCategory.toLowerCase() === "all" ? expenses : expenses.filter(item => item.category === selectedCategory))  // Filter categories
	  .filter(item => search === '' || item.name.toLowerCase().includes(search.toLowerCase()))  // Filter search
	  .filter(item => selectedCountries.length === 0 || selectedCountries.includes(item.country)));  // Filter countries

  }, [selectedCategory, selectedCountries, search])

	const groupedExpenses = filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).reduce((result, item) => {
		const isoDate = new Date(item.date).toISOString().split('T')[0];
		if (!result[isoDate]) {
			result[isoDate] = []
		}
		result[isoDate].push(item);
		return result;
	}, {});

  useEffect(() => {
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
    // selectRef.current.style.overflowX = 'visible';
  }

  const onClose = () => {
    selectRef.current.style.overflowY = 'hidden';
    selectRef.current.scrollLeft = 0;
    // selectRef.current.style.overflowX = 'visible';
  }

	return (
		<div className="s-overlay">
			{isEmpty && 
        	<div className="empty-expenses-container">
        	  <span>Looks kinda empty, try adding a new expense by clicking on that red</span>
        	  <span className="text-plus"> +</span>
        	  <span> on the bottom.</span>
        	</div>
      		}
			<AddButton  expenses={expenses} setExpenses={setExpenses}/>
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
			</div>

			{Object.entries(groupedExpenses).map(([isoDate, items]) => (
				<div key={isoDate}>
					<div className="date-header">
						<span className="total">
							{curSymbol}{items.reduce((sum, item) => sum + item.convertedPrice, 0).toFixed(2)}{" "}
						</span>
						<span>{isoDate}</span>
					</div>
					{items.map((item) => (
						<div className='item-header' key={item.expenseId} onClick={() => {setIsDetailOpen(true); setOpenDetailId(item.expenseId)}}>
							<div className="s-price-container">
                        	<span className="item-price" style={{color: item.exclude ? 'rgb(255, 68, 68)' : ''}}>{item.exclude && '('}{curSymbol}{Number(item.convertedPrice).toFixed(2)}{item.exclude && ')'}</span>
								{ item.currency !== baseCurrency &&
								<span className="real-currency">({item.price.toFixed(2)} {item.currency.toUpperCase()})</span>
								}
							</div>
							<div className="item-actions">
								<span>{item.name}</span>
								{/* <img className='item-icon' src={coloredIcons[item.category]}/> */}
								<img className='item-icon' src={getIconSrc(item.category)}/>
								{item.note && <div className="is-note"/>}

							</div>
								{isDetailOpen && openDetailId === item.expenseId && <ExpenseDetails setIsOpen={setIsDetailOpen} expenseId={openDetailId} expenses={expenses} setExpenses={setExpenses}/>}

						</div>
					))}
				</div>
			))}
		</div>
	)
}