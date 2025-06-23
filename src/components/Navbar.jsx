import React from 'react';
import './Navbar.css';
import { icons } from './constants';
import { NavLink, useLocation } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { setIconColor, parseRgbaString } from './HelperFunctions';

const Navbar = () => {
  const location = useLocation();
  const navbarIcons = ['Home',' Expenses', 'Search', "Settings"];
  const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);
  const isSearchActive = location.pathname.startsWith('/search/');

  const getIconSrc = (iconName, color)=> {
    // const color = 'rgba(255, 255, 255, 1)'
    const cacheKey = `${iconName}-${color}`
    if (cachedIcons[cacheKey]) {
      return cachedIcons[cacheKey];
    }
    // If the icon is not catched
    async function iconsCach(iconName, colorStr) {
      const cacheKey = `${iconName}-${colorStr}`;
      const iconRgba = parseRgbaString(colorStr);
      const iconSrc = icons[iconName];
      const dataUrl = await setIconColor(iconSrc, iconRgba);
      setCachedIcons(prev => ({ ...prev, [cacheKey]: dataUrl }));
    }
    Promise.all(
    [[iconName, color]].map(([name, color]) => iconsCach(name, color)))
      
    return icons[iconName]
  }

return (
<nav className="new-navbar">
  <NavLink to="/">
  {({ isActive }) => (
    <div className='navbar-icon-container'>
      {/* <img src={icons["Home"]} className='navbar-icon'/> */}
      <img src={(isActive ? getIconSrc("Home", 'rgba(198, 98, 98, 1)') : getIconSrc("Home", 'rgba(255, 255, 255, 1)'))} className='navbar-icon'/>
    </div>
    )}
  </NavLink>

  <NavLink to="/expenses">
    {({ isActive }) => (
    <div className='navbar-icon-container'>
      <img src={(isActive ? getIconSrc("Expenses", 'rgba(198, 98, 98, 1)') : getIconSrc("Expenses", 'rgba(255, 255, 255, 1)'))} className='navbar-icon'/>
    </div>
    )}
  </NavLink>

  <NavLink to="/search/all">
    <div className='navbar-icon-container'>
      <img src={(isSearchActive ? getIconSrc("Search", 'rgba(198, 98, 98, 1)') : getIconSrc("Search", 'rgba(255, 255, 255, 1)'))} className='navbar-icon'/>
    </div>
  </NavLink>

  <NavLink to="/settings">
    {({ isActive }) => (
    <div className='navbar-icon-container'>
      <img src={(isActive ? getIconSrc("Settings", 'rgba(198, 98, 98, 1)') : getIconSrc("Settings", 'rgba(255, 255, 255, 1)'))} className='navbar-icon'/>
    </div>
    )}
  </NavLink>
</nav>
);
};

export default Navbar;