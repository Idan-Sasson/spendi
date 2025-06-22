import { useEffect, useState, useRef } from "react";
import countries from "./countries.json";
import './CountryModal.css'
import ReactDOM from 'react-dom'

export default function CountryModal({setIsOpen, selectedCountry, setSelectedCountry, categoryColor, wrapperPosition, isPortal}) {
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
  
    // return (isPortal ? ReactDOM.createPortal : '')(
    const content = (
      <>
        <div className="countries-overlay" onClick={handleClose} />
        <div className={`modal-wrapper ${isClosing ? 'scale-down' : ''}`} onAnimationEnd={handleAnimationEnd} style={{borderColor: categoryColor, ...wrapperPosition}}>
          <div className="countries-wrapper">
            {Object.keys(countries).sort().map(country => (
              <div key={country} onClick={() => handleCountryClick(country)}
              className={`country-wrapper ${selectedCountry === country ? 'selected-country' : ''}`}
              // style={{backgroundColor: selectedCountry === country ? categoryColor : 'rgb(255, 255, 255)'}}
              >
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