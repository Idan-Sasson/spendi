import { useEffect, useState } from "react";
import './Search.css'
import { useLocalStorage } from "./useLocalStorage";
import { useParams } from "react-router-dom";
import { AppOptions, categories, icons } from "./constants";
import { setIconColor, parseRgbaString } from "./HelperFunctions";
import AddButton from "./AddButton";
import ExpenseDetails from "./ExpenseDetails";
import CustomSelect from "./customs/CustomSelect";
// import { setDefaultLocale } from "react-datepicker";

export default function CategoryDetails() {

  const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  // const recoloredIconsRef = useRef({});
  // const [, forceUpdate] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [openDetailId, setOpenDetailId] = useState('');
  const [search, setSearch] = useState('');
	
	let { category } = useParams();
	useEffect(() => {
		if (!categories.some(c => c.name === category)) {
			setSelectedCategory("All");
		}
		else {
			setSelectedCategory(category);
		}
	}, []);

	// const [filterCategory, setFilterCategory] = useState(category);
	let filteredExpenses = (selectedCategory.toLowerCase() === "all" ? expenses : expenses.filter(item => item.category === selectedCategory))
	.filter(item => search === '' || item.name.toLowerCase().includes(search.toLowerCase()));

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
      const cacheKey = `${cat.name}-${cat.color}`;
      if (cachedIcons[cacheKey]) return false
      return [cat.name, cat.color];
    })};
    let toColor = isAllColored()
    if (toColor.every(item => item === false)) {
    }
    else {
      console.log(toColor);
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
    const color = categories.find(cat => cat.name == category)?.color
    const cacheKey = `${category}-${color}`
    if (cachedIcons[cacheKey]) {
      return cachedIcons[cacheKey];
    }
    return icons[category]
  }
  
	return (
		<div className="s-overlay">
			<AddButton  expenses={expenses} setExpenses={setExpenses}/>
			<div className="s-options-header">
				{/* <div className="s-dropdown">Select</div> */}
				{/* <CustomSelect onSelect={val => console.log("Selected:", val)} options={[{ name: "All" }, ...categories].map(category => category.name)} optionTitle={selectedCategory} setOption={setSelectedCategory}> */}
				<CustomSelect onSelect={val => setSelectedCategory(val)} optionTitle={selectedCategory} style={{boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)', paddingBottom: '1px'}}>
					<div data-value="All" className="s-option-container">
						<img className="s-filter-icon" src={icons["All"]} />
						<div key={"AlLl"} >All</div>
					</div>
					{categories.map((cat) => (
						<div data-value={cat.name} className="s-option-container">
							<img className="s-filter-icon" src={getIconSrc(cat.name)} />
							<div key={cat.name} >{cat.name}</div>
						</div>
					))}
				</CustomSelect>
					<input className='search-input' onChange={(e) => setSearch(e.target.value)} placeholder="Search"/>
			</div>
			{Object.entries(groupedExpenses).map(([isoDate, items]) => (
				<div>
					<div className="date-header" key={isoDate}>
						<span className="total">
							₪{items.reduce((sum, item) => sum + item.convertedPrice, 0).toFixed(2)}{" "}
						</span>
						<span>{isoDate}</span>
					</div>
					{items.map((item) => (
						<div className='item-header' key={item.id} onClick={() => {setIsDetailOpen(true); setOpenDetailId(item.id)}}>
							<div className="s-price-container">
								<div className="">₪{item.convertedPrice.toFixed(2)}</div>
								{ item.currency !== AppOptions.baseCurrency &&
								<span className="real-currency">({item.price.toFixed(2)} {item.currency.toUpperCase()})</span>
								}
							</div>
							<div className="item-actions">
								<span>{item.name}</span>
								{/* <img className='item-icon' src={coloredIcons[item.category]}/> */}
								<img className='item-icon' src={getIconSrc(item.category)}/>
								{item.note && <div className="is-note"/>}

							</div>
								{isDetailOpen && openDetailId === item.id && <ExpenseDetails setIsOpen={setIsDetailOpen} expenseId={openDetailId} expenses={expenses} setExpenses={setExpenses}/>}

						</div>
					))}
				</div>
			))}
		</div>
	)
}