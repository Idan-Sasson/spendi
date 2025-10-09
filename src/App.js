import Home from './components/Home';
import Navbar from './components/Navbar';
// npx http-server build -S -C localhost.pem -K localhost-key.pem -p 3000
import './App.css';
import { useSyncExpenses } from './components/firebaseHooks/useSyncExpenses';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Expenses from './components/Expenses';
import Tests from './components/tests';
import Search from './components/Search';
import Settings from './components/Settings';
import Auth from './components/Auth'
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { auth } from './config/firebase';
import { useLocalStorage } from './components/useLocalStorage';

function App() {
  const { syncExpenses } = useSyncExpenses();
  const hasMount = useRef(false);
  const [ipCountry, setIpCountry] = useLocalStorage("ipCountry", '')
  const [filtersResetLoaded, setFiltersResetLoaded] = useState(false);
  const didRun = useRef(false);

  // Run before paint to avoid a 1-frame flash
  useEffect(() => {
    // if (didRun.current) return; // avoid React 18 StrictMode double-run in dev
    // didRun.current = true;
    localStorage.setItem('selectedCountries', JSON.stringify([]));
    localStorage.setItem('selectedSecCat', JSON.stringify([]));
    setFiltersResetLoaded(true);
  }, []);

  // useEffect(() => {  // Reset filters
  //   console.log("remounts");
  //   setSelectedCountries([]);
  //   setSelectedSecCat([]);
  //   setResetKey(Date.now());
  // }, [])

  useEffect(() => {
    const fetchCountry = async () => {  // Fetch country by ip
      try {
        const res = await fetch(`https://ipapi.co/json`);
        const data = await res.json();
        let ipCountry = data["country_name"]
        if (ipCountry) setIpCountry(ipCountry);
        else setIpCountry('');
      } catch (err) {
        console.error(err);
        setIpCountry('');
      }
    }
    fetchCountry();
  }, [])

  // useEffect(() => {  // Disabling ip-looup for testings
  //   setIpCountry("Greece")
  // }, [])

  // useEffect(() => {
  //   const user = auth.currentUser
  //   if (user?.uid) {
  //     console.log("Sync1");
  //     syncExpenses(user.uid)
  //   } else {
  //     // Listen for when auth is ready
  //     const unsubscribe = auth.onAuthStateChanged((user) => {
  //       if (user?.uid) {
  //         console.log("Sync2");
  //         syncExpenses(user.uid);
  //       }
  //     })
  //     return unsubscribe;
  //   }
  // }, [])


  // Trying different approches to battle against the duplications
  useEffect(() => {
    const user = auth.currentUser
    // Listen for when auth is ready
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        console.log("Sync2");
        syncExpenses(user.uid);
      }
    })
    return unsubscribe;
  }, [])

  return (
    <HashRouter>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={filtersResetLoaded ? <Home /> : null} />

        <Route path="/search/:category" element={<Search />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
