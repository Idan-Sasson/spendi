import React, { useState, useEffect } from 'react'
import { auth, db } from '../config/firebase'
import { createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
// import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useLocalStorage } from './useLocalStorage';
import { useSyncExpenses } from './firebaseHooks/useSyncExpenses';
// import { useGetAllExpenses } from './firebaseHooks/useGetAllExpenses';
import { getAllExpenses } from './firebaseHooks/getAllExpenses';
import firebase from 'firebase/compat/app';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Auth() {
  // const firebaseExpenses = useGetAllExpenses();
  const [authInfo, setAuthInfo] = useLocalStorage("auth", {})
  const [localExpenses, setLocalExpenses] = useLocalStorage("expenses", []);
  const { syncExpenses } = useSyncExpenses();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const handleSignIn = async () => {
    const result = await signInWithEmailAndPassword(auth, email, password);
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
  };

  const handlelogOut = async () => {
    setLocalExpenses([])
    await signOut(auth);
    setAuthInfo({});

  }

  const handleSignUp = async () => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const authData = {
      userID: result.user.uid,
      email: result.user.email,
      isAuth: true
    };
    setAuthInfo(authData);
    await syncExpenses(authData["userID"]);
  }

  return (
    <div>
      <input placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
      <input placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign in</button>
      <button onClick={handlelogOut}>Log out</button>
      <button onClick={handleSignUp}>Sign up</button>
      {<div>{auth?.currentUser?.email}</div>}
    </div>
  )
}
