import { useState, useRef, useEffect } from "react"
import "./CustomSelect.css"
import React from "react";
import { icons } from "../constants";

export default function CustomSelect({ children, onSelect, optionTitle, style}) {
// export default function CustomSelect({ children, options, optionTitle, setOption }) {
  /*
  optionTitle - Option shown on top of the select dropdown
  style - Style for the title
  */
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const optionsRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [longest, setLongest] = useState('')
    
    const handleToggle = () => setIsOpen(status => !status);

    const handleClick = (e) => {
      const value = e.currentTarget.dataset.value;
      onSelect?.(value);
      setIsOpen(false);
    }

      // Clone each child and inject onClick
const clonedChildren = React.Children.toArray(children).map((child, index, arr) =>
  React.cloneElement(child, {
    onClick: handleClick,
    className: `${child.props.className ?? ''}
    ${index === arr.length - 1 ? 'last' : ''}
    ${child.props['data-value'] === optionTitle ? 'selected' : ''}`
    .trim()
  })
);

    useEffect(() => {  // Exit on click outside of the area
        function handleOutsideClick(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick)
    }, [])

    const getLongestDataValue = (children) => {
      return React.Children.toArray(children).reduce((longest, child) => {
        const val = child.props['data-value'] ?? '';
        return val.length > longest.length ? val : longest;
      }, '');
    };

    useEffect(() => {
      setLongest(getLongestDataValue(children));
    }, [children]);

    return (
    <>
      <div className="cs-overlay">
        <div onClick={handleToggle} className="select-title" style={style}>
          <div className="select-tabs">
            <span className="cs-title">{optionTitle}</span>
            <img className={`dropdown-icon ${isOpen ? 'icon-active' : ''}`} src={icons["Dropdown"]} />
          </div>
          <span className="cs-invisible">..{longest} ^..</span>
          </div>
        <div className={`dropdown-container ${isOpen ? 'dropdown-open' : ''}`} ref={optionsRef}>

          <div className="cs-children">
            {clonedChildren}
          </div>
        </div>
      </div>
      {isOpen && (<div className="fullscreen-overlay" onClick={(e) => {setIsOpen(false); e.stopPropagation()}}>
      </div>)}
      </>
    );
}