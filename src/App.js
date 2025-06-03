import React from 'react';
// import logo from './logo.svg';
// import { useState } from 'react'
import Home from './components/Home'
import AddExpense from './components/AddExpense'
import Navbar from './components/Navbar'
import ExpenseDetails from './components/ExpenseDetails'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import BrowserRouter for routing

function App() {
    return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expenses" element={<AddExpense />} />
        <Route path="/expense/:id" element={<ExpenseDetails />} /> 
      </Routes>
    </Router>
  );
}

export default App;
