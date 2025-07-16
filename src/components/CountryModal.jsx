import { useEffect, useState, useRef } from "react";
import countries from "./countries.json";
import './CountryModal.css'
import ReactDOM from 'react-dom'

export default function CountryModal({setIsOpen, selectedCountry, setSelectedCountry, categoryColor, wrapperPosition, isPortal, type=undefined}) {  // showOnly - either country or currency
    // const [selectedCountry]
    const selectedRef = useRef(null);
    const [filteredCountries, setFilteredCountries] = useState(Object.keys(countries));
    const [isClosing, setIsClosing] = useState(false);
    const [search, setSearch] = useState('');

    const handleCountryClick = (country) => {
        if (!type || type==="country") {
          setSelectedCountry(country);
        }
        else {
          setSelectedCountry(countries[country]);
        }

        handleClose();
    }
    
    const handleClose = () => {
        // setIsOpen(false);
        setIsClosing(true);
    }

    const handleAnimationEnd = () => {
      if (isClosing) {
        setIsOpen(false);
      }
    }

    const handleSearchChange = (e) => {
      const currentSearch = e.target.value
      setSearch(currentSearch);
      if (currentSearch.trim() === '') {
        // console.log(currentSearch);
        setFilteredCountries(Object.keys(countries));
      }
      else {
        const countriesFilter = Object.keys(countries).filter(key => key.toLowerCase().split(" ").some(word => word.startsWith(currentSearch.toLowerCase())));
        const currenciesFilter = Object.values(countries).filter(key => key.toLowerCase().startsWith(currentSearch.toLowerCase()));
        const currencies2countries = Object.keys(countries).filter(country => currenciesFilter.includes(countries[country]));
        setFilteredCountries([... new Set([...countriesFilter, ...currencies2countries])]);
      }
    };


  useEffect(() => {
    setTimeout(() => {  // Time out so it can scroll when the animation is finished
      selectedRef.current?.scrollIntoView({ block: "center", behavior: "auto" });
    }, 100);
  }, []);
  
    const content = (
      <>
        <div className="countries-overlay" onClick={handleClose} />
        <div className={`modal-wrapper ${isClosing ? 'scale-down' : ''}`} onAnimationEnd={handleAnimationEnd} style={{borderColor: categoryColor, ...wrapperPosition}}>
        <input value={search} onChange={handleSearchChange} className="search-country" placeholder="Search Country"/>
          <div className="countries-wrapper">
            {filteredCountries.sort().map(country => (
              <div key={country} onClick={() => handleCountryClick(country)}
              className={`country-wrapper ${selectedCountry === country ? 'selected-country' : ''}`}>
                <span className='country-option'
                  ref={country === selectedCountry ? selectedRef : null}>
                  {country}
                </span >
                <span className="modal-currency">{countries[country].toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
        </>
    )
  return isPortal ? ReactDOM.createPortal(content, document.body) : content;
}