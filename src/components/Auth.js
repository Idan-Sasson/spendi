import React, { useState, useEffect } from 'react'
import { auth, db } from '../config/firebase'
import { createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useLocalStorage } from './useLocalStorage';

export default function Auth() {
  const [authInfo, setAuthInfo] = useLocalStorage("auth", {})
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const handleSignIn = async () => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const authData = {
      userID: result.user.uid,
      email: result.user.email,
      isAuth: true
    };
    setAuthInfo(authData);
    // console.log(authData);
  };

  const handlelogOut = async () => {
    await signOut(auth);
  }

  return (
    <div>
      <input placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
      <input placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign in</button>
      <button onClick={handlelogOut}>Sign out</button>
      {<div>{auth?.currentUser?.email}</div>}
    </div>
  )
}
