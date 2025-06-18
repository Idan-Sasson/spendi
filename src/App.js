import Home from './components/Home';
import Navbar from './components/Navbar';
import ExpenseDetails from './components/ExpenseDetails';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import AddButton from './components/AddButton';
import Expenses from './components/Expenses';
import Income from './components/Income';
import Tests from './components/tests';
import Search from './components/Search';

const isOpen = false;
function App() {
  return (
    <HashRouter>
      <Navbar />
      {/* <AddButton /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/income" element={<Income />} />
        <Route path="/search/:category" element={<Search />} />
        <Route path="/tests" element={<Tests />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
