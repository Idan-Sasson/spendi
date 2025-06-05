import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (

<nav className="navbar">
  <div className="navbar-center">
    <ul className="nav-links">
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/expenses">Expenses</Link>
      </li>
    </ul>
  </div>
</nav>
);
};

export default Navbar;