import React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {

return (
<nav className="navbar">
  <div className="navbar-center">
    <ul className="nav-links">
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/expenses"
          className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
        >
          Expenses
        </NavLink>
      </li>
    </ul>
  </div>
</nav>
);
};

export default Navbar;