import { useEffect, useState } from 'react'

export default function CustomSelect2({ items, selected, setSelected, className }) {
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [filteredSelected, setFilteredSelected] = useState(selected);

    useEffect(() => {
      document.body.style.overflow = isSelectionOpen ? "hidden" : "";
      setSearch('');
  }, [isSelectionOpen]);


  const handleSelectItem = (item) => {
    if (selected.includes(item)) {
      setSelected(prev => prev.filter(i => i !== item))
    }
    else setSelected(prev => [...prev, item])  // Insert to top of the dropdown menu
  }

  useEffect(() => {
    const currentSearch = search;
    setSearch(currentSearch);
    if (currentSearch.trim() === '') {  // If search empty - show all
      setFilteredItems(items);
      setFilteredSelected(selected);
    }
    else {
      const itemsFilter = items.filter(key => key.toLowerCase().split(" ").some(word => word.startsWith(currentSearch.toLowerCase())));
      const selectedFilter = selected.filter(key => key.toLowerCase().split(" ").some(word => word.startsWith(currentSearch.toLowerCase())));
      setFilteredItems(itemsFilter);
      setFilteredSelected(selectedFilter);
    }
  }, [search, selected])

  const isSelected = (item) => {
    return selected.includes(item);
  }

  const isSelectedAll = () => {  // Checks if 1 or more items are selected
    return selected.length > 0;
  }

  return (
    <div>
      <div className={`cm-title ${isSelectedAll() ? 'cm-title-selected' : ''} ${className}`} onClick={() => setIsSelectionOpen(true)}>Secondary Category</div>

      {isSelectionOpen && 
      <div className='country-modal-selection-dropdown'>
          <div className='cm-overlay' onClick={(e) => {setIsSelectionOpen(false); e.stopPropagation()}}></div>
            <div className='countries-dropdown-container'>
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="cm-search-country" placeholder="Search Category..."/>
              {filteredSelected.sort().map(item => (
                <div className='cm-country cm-selected' key={item + "hidden"} onClick={() => handleSelectItem(item)}>{item}</div>
              ))}
              {filteredItems.sort().map(item => (
                <div className={`cm-country ${isSelected(item) ? 'hide' : ''}`} key={item} onClick={() => handleSelectItem(item)}>{item}</div>
              ))} 

            </div>
      </div>
      }
    </div>
  )
}
