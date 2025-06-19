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
import coloredAccommodation from "../assets/icons/colored/coloredAccommodations.png"
import coloredCar from "../assets/icons/colored/coloredCar.png"
import coloredEntertainment from "../assets/icons/colored/coloredEntertainment.png"
import coloredFees from "../assets/icons/colored/coloredFees.png"
import coloredFlights from "../assets/icons/colored/coloredFlights.png"
import coloredGeneral from "../assets/icons/colored/coloredGeneral.png"
import coloredFood from "../assets/icons/colored/coloredFood.png"
import coloredGroceries from "../assets/icons/colored/coloredGroceries.png"
import coloredOther from "../assets/icons/colored/coloredOther.png"
import coloredShopping from "../assets/icons/colored/coloredShopping.png"
import dropdown from "../assets/icons/dropdown.png"
import all from "../assets/icons/all.png"
import calendar from "../assets/icons/calendar.png"



export const categories = [  // https://codepen.io/sosuke/pen/Pjoqqp
  { name: "General", color: "rgba(32, 212, 140, 1)", isExpense: true, filter: 'invert(63%) sepia(79%) saturate(449%) hue-rotate(102deg) brightness(94%) contrast(87%)' },
  { name: "Food", color: "rgba(98, 240, 33, 1)", isExpense: true, filter: 'invert(85%) sepia(27%) saturate(5463%) hue-rotate(50deg) brightness(109%) contrast(88%)' },
  { name: "Car", color: "rgba(254, 231, 21, 1)", isExpense: true, filter: 'invert(85%) sepia(36%) saturate(1053%) hue-rotate(348deg) brightness(111%) contrast(99%)' },
  { name: "Entertainment", color: "rgba(225, 70, 13, 1)", isExpense: true, filter: 'invert(31%) sepia(48%) saturate(2706%) hue-rotate(355deg) brightness(96%) contrast(98%)' },
  { name: "Groceries", color: "rgba(32, 98, 221, 1)", isExpense: true, filter: 'invert(26%) sepia(84%) saturate(1542%) hue-rotate(204deg) brightness(104%) contrast(100%)' },
  { name: "Flights", color: "rgba(235, 148, 19, 1)", isExpense: true, filter: 'invert(66%) sepia(33%) saturate(2122%) hue-rotate(352deg) brightness(95%) contrast(94%)' },
  { name: "Accommodations", color: "rgba(255, 9, 222, 1)", isExpense: true, filter: 'invert(17%) sepia(97%) saturate(3899%) hue-rotate(300deg) brightness(111%) contrast(111%)' },
  { name: "Shopping", color: "rgba(20, 233, 233, 1)", isExpense: true, filter: 'invert(83%) sepia(97%) saturate(766%) hue-rotate(113deg) brightness(95%) contrast(92%)' },
  { name: "Fees", color: "rgba(255, 0, 0, 1)", isExpense: true, filter: 'invert(13%) sepia(82%) saturate(6740%) hue-rotate(4deg) brightness(111%) contrast(122%)' },
  { name: "Other", color: "rgba(197, 197, 197, 1)", isExpense: true, filter: 'invert(99%) sepia(0%) saturate(1171%) hue-rotate(181deg) brightness(83%) contrast(84%)' },
  // { name: "Salary", color: 'rgba(99, 138, 0,1)', isExpense: false, filter: '' },
  // { name: "Gift", color: 'rgba(7, 255, 52, 1)', isExpense: false, filter: '' }
  // { name: "Other", color: 'rgba(38, 249, 179, 1)', isExpense: false, filter: '' }

];

export const AppOptions = {
  "baseCurrency": 'ils'
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
  Calendar: calendar
}

export const coloredIcons = {
  Groceries: coloredGroceries,
  Car: coloredCar,
  Food: coloredFood,
  General: coloredGeneral,
  Flights: coloredFlights,
  Entertainment: coloredEntertainment,
  Other: coloredOther,
  Accommodations: coloredAccommodation,
  Shopping: coloredShopping,
  Fees: coloredFees
}

