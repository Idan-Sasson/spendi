import React, { useEffect, useState } from 'react'
import { AppOptions } from '../constants'
import "./AuthModal.css"
import Auth from '../Auth'
import { auth } from '../../config/firebase';
import { useLocalStorage } from '../useLocalStorage';

export default function AuthModal({setIsOpen, setEmail}) {
  const [authInfo, setAuthInfo] = useLocalStorage("auth", {})
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [_, forceUpdate] = useState(0);
  
  useEffect(() => {
    if (auth?.currentUser?.email && authInfo["isAuth"]) {
      setIsLoggedIn(true);
    }
  }, [])

  const handleClose = () => {
    setIsClosing(true);
    setEmail(auth?.currentUser?.email)
  }

  const handleAnimationEnd = () => {
    if (isClosing){
      forceUpdate(n => n+1)
      setIsOpen(false);
    }
  }


  return (
    // <div className='auth-modal-overlay' style={{backgroundColor: AppOptions["backgroundColor"]}}>
    <div className={`cc-overlay ${isClosing ? 'slide-out' : ''}`} style={{backgroundColor: AppOptions["backgroundColor"]}} onAnimationEnd={handleAnimationEnd}>
      <div className='settings-topborder'>
        <div className='settings-title '>{isLoggedIn ? 'Account' : 'Login'}</div>
      </div>
        <div className={`settings-modal-body-wrapper`}>

          <div className='auth-container'>
            <Auth setIsOpen={handleClose} setIsLoggedInModal={setIsLoggedIn}/>

          </div>
        </div>
        {/* <button onClick={() => setIsOpen(false)}>Close</button> */}
    </div>
  )
}
