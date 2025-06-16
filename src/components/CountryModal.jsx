import { useEffect, useState, useRef } from "react";
import countries from "./countries.json";
import './CountryModal.css'

export default function CountryModal({setIsOpen, selectedCountry, setSelectedCountry, categoryColor}) {
    // const [selectedCountry]
    const selectedRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);

    const handleCountryClick = (country) => {
        setSelectedCountry(country);
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

  useEffect(() => {
  const timeout = setTimeout(() => {  // Time out so it can scroll when the animation is finished
    selectedRef.current?.scrollIntoView({ block: "center", behavior: "auto" });
  }, 100);
  }, []);
  
    return(
      <>
        <div className="countries-overlay" onClick={handleClose} />
        <div className={`modal-wrapper ${isClosing ? 'scale-down' : ''}`} onAnimationEnd={handleAnimationEnd} style={{borderColor: categoryColor}}>
          <div className="countries-wrapper">
            {Object.keys(countries).sort().map(country => (
              <div key={country} onClick={() => handleCountryClick(country)}
              className={`country-wrapper ${selectedCountry === country ? 'selected-country' : ''}`}
              // style={{backgroundColor: selectedCountry === country ? categoryColor : 'rgb(255, 255, 255)'}}
              >
                <span className='country-option'
                  ref={country === selectedCountry ? selectedRef : null}>
                  {country}
                </span>
                <span className="modal-currency">{countries[country]}</span>
              </div>
            ))}
          </div>
        </div>
        </>
    )
}