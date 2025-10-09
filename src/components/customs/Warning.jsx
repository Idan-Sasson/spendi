import React from 'react'
import './Warning.css'


export default function Warning({ warning, options, setSelected, setOpen }) {
    const handleClose = (option) => {
        setSelected(option);
        setOpen(false);
    }
    
    return (
    <div className='warning-overlay'>
        <div className='warning-container'>
            <div className='warning-warning'>
              {warning}
            </div>
            <div className='warning-options'>
                {options.map(option => (
                    <button className='warning-buttons' onClick={() => handleClose(option)} key={option}>{option}</button>
                ))}
            </div>
        </div>
    </div>
  )
}
