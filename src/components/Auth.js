import { useState, useEffect } from 'react'
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
// import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useLocalStorage } from './useLocalStorage';
import { useSyncExpenses } from './firebaseHooks/useSyncExpenses';
// import { useGetAllExpenses } from './firebaseHooks/useGetAllExpenses';
import { getAllExpenses } from './firebaseHooks/getAllExpenses';
import { signInWithEmailAndPassword } from 'firebase/auth';
import "./Auth.css"

export default function Auth({ setIsOpen }) {
  // const firebaseExpenses = useGetAllExpenses();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authInfo, setAuthInfo] = useLocalStorage("auth", {})
  const [localExpenses, setLocalExpenses] = useLocalStorage("expenses", []);
  const [error, setError] = useState('');
  const { syncExpenses } = useSyncExpenses();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (auth?.currentUser?.email && authInfo["isAuth"]) {
      setIsLoggedIn(true);
    }
  }, [])

  const handleSignIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      const authData = {
        userID: result.user.uid,
        email: result.user.email,
        isAuth: true
      };
      setAuthInfo(authData);
      await syncExpenses(authData["userID"]);
      const firebaseExpenses = await getAllExpenses(authData["userID"]);
      setLocalExpenses(firebaseExpenses);
      console.log(firebaseExpenses);
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        console.log('Invalid email');
        setError("Please enter a valid email.");
      }
      else if (err.code === 'auth/invalid-credential') {
        console.log('Incorrect mail');
        setError('Incorrect email or password v');
      }
      else {
        console.log("Login failed", err.message);
        setError("Something went wrong, try again later");
      }
    }
  };

  const handlelogOut = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setLocalExpenses([])
    setAuthInfo({});

  }

  const handleSignUp = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      const authData = {
        userID: result.user.uid,
        email: result.user.email,
        isAuth: true
      };
      setAuthInfo(authData);
      await syncExpenses(authData["userID"]);
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        console.log('Invalid email');
        setError("Please enter a valid email.");
      }
      else if (err.code === 'auth/missing-password' || err.code === 'auth/missing-email') {
        console.log('Missing section');
        setError('Please fill all required sections');
      }
      else if (err.code === 'auth/weak-password') {
        console.log('Password must be 6 characters');
        setError("Password should be at least 6 characters");
      }
      else if (err.code === 'auth/email-already-in-use') {
        console.log("Email already in use")
        setError("Email already in use")
      }
      else {
        console.log("Sign up failed", err.message);
        setError("Something went wrong, try again later");
      }
    }
  }

  return (
    <div className='auth-wrapper'>
      <div className='auth-logged-in'>
        {isLoggedIn &&
          <button onClick={handlelogOut}>Log out</button>
        }
      </div>

      <div className='auth-logged-out'>
        {!isLoggedIn &&
          <div>
            <div className='auth-login-title'>
              {/* <div>Login</div> */}
            </div>
            <div className='auth-inputs-container'>
              <div className='auth-input-container'>
                <div className='auth-inputs-title'> Email </div>
                <input className='auth-input-holder' placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className='auth-input-container'>
                <div className='auth-inputs-title'> Password </div>
                <input className='auth-input-holder' placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className='auth-buttons-container'>
                <div className='auth-button sign-in' onClick={handleSignIn}>Login</div>
                <div className='auth-button sign-up' onClick={handleSignUp}>Sign up</div>
              </div>
              <div className='auth-guest-text' onClick={() => setIsOpen(false)}> Continue as a guest </div>
            </div>
          </div>
        }
      </div>

      {<div>{auth?.currentUser?.email}</div>}
    </div>
  )
}
