import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (

<nav className="navbar">
  <div className="navbar-center">
    <ul className="nav-links">
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/expenses">Expenses</a>
      </li>
    </ul>
  </div>
</nav>
);
};

export default Navbar;