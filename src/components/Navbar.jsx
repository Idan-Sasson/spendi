import React from 'react';
import './Navbar.css';
import { NavLink, useLocation  } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

return (
<nav className="navbar">
  <div className="navbar-center">
    <ul className="nav-links">
      <li>
        <NavLink to="/"className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}>Home</NavLink>
      </li>
      <li>
        <NavLink to="/expenses" className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}>Expenses</NavLink>
      </li>
      <li>
        <NavLink to="/income" className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}>Income</NavLink>
      </li>      
      <li>
        <NavLink to="/filter/all" className={`nav-link ${location.pathname.startsWith('/filter/') ? 'active-link' : ''}`}>Filter </NavLink>
      </li>
    </ul>
  </div>
</nav>
);
};

export default Navbar;