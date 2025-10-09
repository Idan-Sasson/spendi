import groceries from '../assets/icons/groceries.png'
import car from '../assets/icons/car.png'
import food from '../assets/icons/food.png'
import general from '../assets/icons/general.png'
import flights from '../assets/icons/flights.png'
import entertainment from '../assets/icons/entertainment.png'
import other from '../assets/icons/other.png'
import accommodations from '../assets/icons/accommodations.png'
import fees from '../assets/icons/fees.png'
import back from '../assets/icons/back.png'
import shopping from '../assets/icons/shopping.png'
import plus from '../assets/icons/plus.png'
import note from "../assets/icons/note.png"
import dropdown from "../assets/icons/dropdown.png"
import all from "../assets/icons/all.png"
import calendar from "../assets/icons/calendar.png"
import home from "../assets/icons/home.png"
import search from "../assets/icons/search.png"
import expenses from "../assets/icons/expenses.png"
import settings from "../assets/icons/settings.png"
import arrow from "../assets/icons/arrow.png"
import Delete from "../assets/icons/delete.png"
import Health from "../assets/icons/Health.png"
import Transport from "../assets/icons/transport.png"

export const categories = [  // https://codepen.io/sosuke/pen/Pjoqqp
  { name: "General", color: "rgba(93, 202, 173, 1)", isExpense: true },
  { name: "Food", color: "rgba(106, 197, 104, 1)", isExpense: true },
  { name: "Car", color: "rgba(241, 191, 68, 1)", isExpense: true },
  { name: "Entertainment", color: "rgba(147, 87, 187, 1)", isExpense: true },
  { name: "Groceries", color: "rgba(79, 166, 255, 1)", isExpense: true },
  { name: "Flights", color: "rgba(235, 148, 19, 1)", isExpense: true },
  { name: "Accommodations", color: "rgba(231, 142, 208, 1)", isExpense: true },
  { name: "Shopping", color: "rgba(20, 233, 233, 1)", isExpense: true },
  { name: "Fees", color: "rgba(255, 0, 0, 1)", isExpense: true },
  { name: "Health", color: "rgba(230, 103, 110, 1)", isExpense: true },
  { name: "Transport", color: "rgba(241, 58, 196, 1)", isExpense: true },
  { name: "Other", color: "rgba(197, 197, 197, 1)", isExpense: true },
  // { name: "Salary", color: 'rgba(99, 138, 0,1)', isExpense: false },
  // { name: "Gift", color: 'rgba(7, 255, 52, 1)', isExpense: false }
  // { name: "Other", color: 'rgba(38, 249, 179, 1)', isExpense: false }
];

export const AppOptions = {
  "baseCurrency": 'ils',
  "backgroundColor": "rgba(239, 240, 239, 1)"
};

export const categoriesColors = categories.reduce((acc, { name, color }) => {
  acc[name] = color;
  return acc;
}, {})

export const icons = {
  Groceries: groceries,
  Car: car,  // To change
  Food: food,
  General: general,
  Flights: flights,
  Entertainment: entertainment,
  Other: other,
  Accommodations: accommodations,
  Shopping: shopping,
  Fees: fees,
  Back: back,
  Plus: plus,
  Note: note,
  Dropdown: dropdown,
  All: all,
  Calendar: calendar,
  Home: home,
  Search: search,
  Expenses: expenses,
  Settings: settings,
  Arrow: arrow,
  Delete,
  Health,
  Transport
}
