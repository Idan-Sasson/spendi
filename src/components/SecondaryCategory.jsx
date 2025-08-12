import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage"
import './SecondaryCategory.css'
import Select from 'react-select';
import { useAllSecondaryCats } from "./HelperFunctions";
import { icons } from "./constants";

export default function SecondaryCategory({ setStrCat, expense, classPrefix}) {
  // TODO
  // Create new category button
  // If there's 1 or more categories change create new category button to select and have "Create new category" and all the other categories.
  // Make a firestore object with the user's all sec categories
  // Check for all categories among all expenses and append to secondaryCategories the categories that are not listed in the localStorage
  const [secondaryCats, setSecondaryCats] = useState(useAllSecondaryCats());
  const [hasCategories, setHasCategories] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [options, setOptions] = useState([]);
  // const [selectOption, setSelectOption] = useState('');
  const [selectOption, setSelectOption] = useState(expense ? {value: expense.secondaryCat, label: expense.secondaryCat} : '');

  // const allSecCats = useAllSecondaryCats();

  // useEffect(() => {  // Get all secCategories so we can show as a list
  //   setSecondaryCats(allSecCats);
  // }, [])

  useEffect(() => {
    if (!selectOption) {  // If Empty
      setStrCat(null);
      return;
    }
    setStrCat(selectOption.value)
  }, [selectOption])

  useEffect(() => {
    if (secondaryCats.length > 0) {
      const mappedCategories = secondaryCats.map(cat => {
        return {value: cat, label: cat}})
      setOptions([
        ...mappedCategories,
      ]);
    }
  }, [secondaryCats])

  useEffect(() => {
    if (secondaryCats.length > 0) setHasCategories(true);
  }, [secondaryCats])

  const createSecondaryCat = () => {
    if (catName.trim() === '') {  // empty
      setIsCreateOpen(false);
      return    
    }
    if (!secondaryCats.includes(catName.trim())) {  // Creates new one unless cat already exists
      const updatedCats = [...secondaryCats, catName.trim()];
      setSecondaryCats(updatedCats);  // Append to localStorage
    }
    setCatName('');
    setSelectOption({value: catName.trim(), label: catName.trim()})
    setIsCreateOpen(false);
  }

  return (
    <div>
      { !hasCategories &&
      <div onClick={() => setIsCreateOpen(true)}>Add a secondary category</div>
      }
      { isCreateOpen && 
        <div className="create-sec-cat-overlay" onClick={() => {setIsCreateOpen(false)}}>
          <div className="create-sec-cat-container" onClick={(e) => e.stopPropagation()}>
            <input className="create-sec-cat-input" placeholder="Enter name of category" onChange={(e) => setCatName(e.target.value)}/>
            <button onClick={createSecondaryCat}>Submit</button>
          </div>
        </div>
      }
      { hasCategories && options &&
        <div className="sec-cat-selector-create-container">            
          <Select options={options} placeholder='Choose a category' onChange={setSelectOption} value={selectOption} classNamePrefix={classPrefix} isClearable/>
          <img src={icons["Plus"]} onClick={() => setIsCreateOpen(true)} className="sec-cat-plus-icn"/>
        </div>
      }
    </div>
  )
}
