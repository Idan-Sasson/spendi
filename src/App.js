import Home from './components/Home';
import Navbar from './components/Navbar';
// import ExpenseDetails from './components/ExpenseDetails';
import './App.css';
import { useSyncExpenses } from './components/firebaseHooks/useSyncExpenses';
import { HashRouter, Routes, Route } from 'react-router-dom';
// import AddButton from './components/AddButton';
import Expenses from './components/Expenses';
import Income from './components/Income';
import Tests from './components/tests';
import Search from './components/Search';
import Settings from './components/Settings';
import Auth from './components/Auth'
import { useEffect } from 'react';
import { auth } from './config/firebase';

const isOpen = false;
function App() {
  const { syncExpenses } = useSyncExpenses();
  useEffect(() => {
    const user = auth.currentUser
    if (user?.uid) {
      syncExpenses(user?.uid)
    } else {
      // Listen for when auth is ready
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user?.uid) {
          syncExpenses(user.uid);
        }
      })
      return unsubscribe;
    }
  }, [])

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
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
