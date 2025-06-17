import { useEffect, useState } from "react";
import './CategoryDetail.css'
import { useLocalStorage } from "./useLocalStorage";
import { useParams } from "react-router-dom";
import { AppOptions, coloredIcons, categories } from "./constants";
import AddButton from "./AddButton";
import ExpenseDetails from "./ExpenseDetails";

export default function CategoryDetails() {
	const [expenses, setExpenses] = useLocalStorage("expenses", []);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [openDetailId, setOpenDetailId] = useState('')
	let { category } = useParams();
	useEffect(() => {
		if (!categories.some(c => c.name === category)) {
			setSelectedCategory("General");
		}
		else {
			setSelectedCategory(category);
		}
	}, []);

	const [filterCategory, setFilterCategory] = useState(category);

	const filteredExpenses = expenses.filter(item => item.category === selectedCategory);

	const groupedExpenses = filteredExpenses.reduce((result, item) => {
		const isoDate = new Date(item.date).toISOString().split('T')[0];
		if (!result[isoDate]) {
			result[isoDate] = []
		}
		result[isoDate].push(item);
		return result;
	}, {});
	// const dateKeys = Object.entries(groupedDate).sort((a, b) => new Date(a[0]) - new Date(b[0]));
					// {items.map((item) => (
					//     <div>
					//         <div>{item.name}</div>
					//         <div>{item.price}</div>
					//         <div>{item.currency}</div>
					//     </div>
					// ))}
	return (
		<div>
			<AddButton  expenses={expenses} setExpenses={setExpenses}/>
			<div>
				<select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
					{categories.map((cat) => (
						<option>{cat.name}</option>
					))}
				</select>
				<div>
					<input placeholder="Search"/>
				</div>
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
							<div className="cd-price-container">
								<div className="">₪{item.convertedPrice.toFixed(2)}</div>
								{ item.currency !== AppOptions.baseCurrency &&
								<span className="real-currency">({item.price.toFixed(2)} {item.currency.toUpperCase()})</span>
								}
							</div>
							<div className="item-actions">
								<span>{item.name}</span>
								<img className='item-icon' src={coloredIcons[selectedCategory]}/>
							</div>
								{isDetailOpen && openDetailId === item.id && <ExpenseDetails setIsOpen={setIsDetailOpen} expenseId={openDetailId} expenses={expenses} setExpenses={setExpenses}/>}

						</div>
					))}
				</div>
			))}
		</div>
	)
}