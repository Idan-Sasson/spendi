import React, { useState } from 'react'
import "./CountryModal2.css"
import countries from "./countries.json"

export default function CountryModal2({selectedCountry, setSelectedCountry, categoryColor=null, }) {
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  console.log(Object.keys(countries)
  );
  return (
    <div>
    {/* <div className='countries-overlay' onClick={() => setIsOpen(false)}></div> */}
        <div onClick={() => setIsSelectionOpen(true)}>Haa</div>
      {isSelectionOpen && 

      <div className='country-modal-selection-dropdown'>
          <div className='countries-overlay' onClick={(e) => {setIsSelectionOpen(false); e.stopPropagation()}}></div>
            <div className='countries-dropdown-container'>
              {Object.keys(countries).map(country => (
                <div>{country}</div>
              ))} 

            </div>
      </div>
      }
    </div>
  )
}
