import groceries from '../assets/icons/groceries.png'
import transport from '../assets/icons/transport.png'
import food from '../assets/icons/food.png'
import general from '../assets/icons/shekel2.png'
import flight from '../assets/icons/plane.png'
import entertainment from '../assets/icons/entertainment.png'
import other from '../assets/icons/other.png'


export const categories = [
  { name: "General", color: "rgba(64, 177, 162, 0.75)" },
  { name: "Food", color: "rgba(98, 240, 33, 0.75)" },
  { name: "Transport", color: "rgba(253, 249, 7, 0.75)" },
  { name: "Entertainment", color: "rgba(230, 48, 48, 0.75)" },
  { name: "Groceries", color: "rgba(41, 112, 204, 0.75)" },
  { name: "Flight", color: "rgba(235, 148, 19, 0.75)" },
  { name: "Other", color: "rgba(215, 20, 233, 0.75)" }
];

export const categoryIcons = {
  Groceries: groceries,
  Transport: transport,
  Food: food,
  General: general,
  Flight: flight,
  Entertainment: entertainment,
  Other: other
}