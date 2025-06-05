import React from 'react';
import Home from './components/Home';
import AddExpense from './components/AddExpense';
import Navbar from './components/Navbar';
import ExpenseDetails from './components/ExpenseDetails';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expenses" element={<AddExpense />} />
        <Route path="/expense/:id" element={<ExpenseDetails />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
