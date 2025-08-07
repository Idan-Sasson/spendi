import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage"
import './SecondaryCategory.css'
import Select from 'react-select';

export default function SecondaryCategory() {
  // TODO
  // Create new category button
  // If there's 1 or more categories change create new category button to select and have "Create new category" and all the other categories.
  // Make a firestore object with the user's all sec categories
  // Check for all categories among all expenses and append to secondaryCategories the categories that are not listed in the localStorage
  const [secondaryCats, setSecondaryCats] = useLocalStorage("secondaryCategories", []);
  const [hasCategories, setHasCategories] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [options, setOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (selectedOption.value == 'Create new category') setIsCreateOpen(true);
    else console.log(selectedOption.value);
  }, [selectedOption])

  useEffect(() => {  
    if (secondaryCats.length > 0) {
      const mappedCategories = secondaryCats.map(cat => {
        return {value: cat, label: cat}})
      setOptions([
        { value: "Create new category", label: "Create new category" },
        ...mappedCategories,
      ]);
    }
  }, [secondaryCats])
  useEffect(() => {
    if (secondaryCats.length > 0) setHasCategories(true);
  }, [secondaryCats])

  const createSecondaryCat = () => {
    if (secondaryCats.includes(catName.trim())) return;  // Category already exists
    const updatedCats = [...secondaryCats, catName];
    setSecondaryCats(updatedCats);  // Append to localStorage 
    setIsCreateOpen(false);
  }
  
  return (
    <div>
      { !hasCategories &&
      <div onClick={() => setIsCreateOpen(true)}>
        Secondary Category
      </div>
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
        <div>
          Testos
          <Select options={options} placeholder='Choose a category' onChange={setSelectedOption}/>
        </div>
      }
    </div>
  )
}
