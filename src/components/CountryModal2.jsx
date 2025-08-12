import { useEffect, useState } from 'react'
import "./CountryModal2.css"
import allCountries from "./countries.json"

export default function CountryModal2({selectedCountries, setSelectedCountries, className=null}) {
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [search, setSearch] = useState('');
  const countries = Object.keys(allCountries);
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [filteredSelected, setFilteredSelected] = useState(selectedCountries);

  useEffect(() => {
      document.body.style.overflow = isSelectionOpen ? "hidden" : "";
      setSearch('');

  }, [isSelectionOpen]);

  const handleSelectCountry = (country) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(prev => prev.filter(c => c !== country))
    }
    else {  // Insert to the top of countries and set as selected
    setSelectedCountries(prev => [...prev, country])
    }
  }

  useEffect(() => {
    const currentSearch = search;
    setSearch(currentSearch);
    if (currentSearch.trim() === '') {  // If search is nothing - show all results
      setFilteredCountries(countries);
      setFilteredSelected(selectedCountries);
    }
    else {
      const countriesFilter = countries.filter(key => key.toLowerCase().split(" ").some(word => word.startsWith(currentSearch.toLowerCase())));
      const selectedFilter = selectedCountries.filter(key => key.toLowerCase().split(" ").some(word => word.startsWith(currentSearch.toLowerCase())));
      setFilteredCountries(countriesFilter);
      setFilteredSelected(selectedFilter);
    }
  }, [search, selectedCountries]);
  
  const isSelected = (country) => {
    return selectedCountries.includes(country)
  }

  const isSelectedAll = () => {
    return selectedCountries.length > 0;
  }

  return (
    <div>
      <div className={`cm-title ${isSelectedAll() ? 'cm-title-selected' : ''} ${className}`} onClick={() => setIsSelectionOpen(true)}>Filter Countries</div>
      
      {isSelectionOpen && 
      <div className='country-modal-selection-dropdown'>
          <div className='cm-overlay' onClick={(e) => {setIsSelectionOpen(false); e.stopPropagation()}}></div>
            <div className='countries-dropdown-container'>
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="cm-search-country" placeholder="Search Country..."/>
              {filteredSelected.sort().map(country => (
                <div className='cm-country cm-selected' key={country + "hidden"} onClick={() => handleSelectCountry(country)}>{country}</div>
              ))}
              {filteredCountries.sort().map(country => (
                <div className={`cm-country ${isSelected(country) ? 'hide' : ''}`} key={country} onClick={() => handleSelectCountry(country)}>{country}</div>
              ))} 

            </div>
      </div>
      }
    </div>
  )
}
