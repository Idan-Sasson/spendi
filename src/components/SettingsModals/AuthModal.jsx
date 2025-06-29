import React, { useEffect, useState } from 'react'
import { AppOptions } from '../constants'
import "./AuthModal.css"
import Auth from '../Auth'
import { auth } from '../../config/firebase';
import { useLocalStorage } from '../useLocalStorage';

export default function AuthModal({setIsOpen}) {
  const [authInfo, setAuthInfo] = useLocalStorage("auth", {})
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    if (auth?.currentUser?.email && authInfo["isAuth"]) {
      setIsLoggedIn(true);
    }
  }, [])

  return (
    <div className='auth-modal-overlay' style={{backgroundColor: AppOptions["backgroundColor"]}}>
      <div className='settings-topborder'>
        <div className='settings-title'>{isLoggedIn ? 'Account' : 'Login'}</div>
      </div>
        <div className='settings-modal-body-wrapper'>
          
          Testos
          <div className='auth-container'>
            <Auth setIsOpen={setIsOpen}/>

          </div>
        </div>
        <button onClick={() => setIsOpen(false)}>Close</button>
    </div>
  )
}
