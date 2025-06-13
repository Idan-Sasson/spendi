import groceries from '../assets/icons/groceries.png'
import car from '../assets/icons/car.png'
import food from '../assets/icons/food.png'
import general from '../assets/icons/general.png'
import flights from '../assets/icons/plane.png'
import entertainment from '../assets/icons/entertainment.png'
import other from '../assets/icons/other.png'
import accommodations from '../assets/icons/accommodations.png'
import fees from '../assets/icons/fees.png'
import back from '../assets/icons/back.png'
import shopping from '../assets/icons/shopping.png'
import plus from '../assets/icons/plus.png'


export const categories = [
  { name: "General", color: "rgba(32, 212, 140, 0.75)" },
  { name: "Food", color: "rgba(98, 240, 33, 0.75)" },
  { name: "Car", color: "rgba(254, 231, 21, 0.75)" },
  { name: "Entertainment", color: "rgba(225, 70, 13, 0.75)" },
  { name: "Groceries", color: "rgba(32, 98, 221, 0.75)" },
  { name: "Flights", color: "rgba(235, 148, 19, 0.75)" },
  { name: "Accommodations", color: "rgba(255, 9, 222, 0.75)" },
  { name: "Shopping", color: "rgba(20, 233, 233, 0.75)" },
  { name: "Fees", color: "rgba(255, 0, 0, 0.75)" },
  { name: "Other", color: "rgba(197, 197, 197, 0.75)" }

];

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
  Plus: plus
}

