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
import { useEffect, useRef } from 'react';
import { auth } from './config/firebase';
import { useLocalStorage } from './components/useLocalStorage';

function App() {
  const { syncExpenses } = useSyncExpenses();
  const hasMount = useRef(false);
  const [ipCountry, setIpCountry] = useLocalStorage("ipCountry", '')

  useEffect(() => {
    // if (!hasMount.current) {  // useEffect runs twice in StrictMode
    //   hasMount.current = true
    //   return
    // };
    // const res = fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    const fetchCountry = async () => {  // Fetch country by ip
      try {
        // const res = await fetch(`http://ip-api.com/json/`);
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/search/:category" element={<Search />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
