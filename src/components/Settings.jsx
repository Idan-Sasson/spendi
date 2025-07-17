import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import "./Settings.css";
import CategoryColors from './SettingsModals/CategoryColors';
import CustomNotification from './customs/CustomNotification';
import CurrencySettings from './SettingsModals/CurrencySettings';
import { useGetUserInfo } from './firebaseHooks/useGetUserInfo';
import Auth from './Auth';
import AuthModal from './SettingsModals/AuthModal';
import { NavLink } from 'react-router-dom';


export default function Settings() {
  const { email } = useGetUserInfo();
  const [currentEmail, setCurrentEmail] = useState(email);
  const [isCatColorOpen, setIsCatColorOpen] = useState(false);
  const [isCurrenciesOpen, setIsCurrenciesOpen] = useState(false);
  const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);
  const [isNotification, setIsNotification] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const arrowPath = "./assets/icons/left.png"

  const handleClearCache = () => {
    setCachedIcons([]);
    setIsNotification(true);
  }

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    meta.setAttribute('content', "rgba(189, 189, 189, 1)")
  }, [])

  return (
    <div>
      {isCatColorOpen && <CategoryColors setIsOpen={setIsCatColorOpen} />}
      {isCurrenciesOpen && <CurrencySettings setIsOpen={setIsCurrenciesOpen} />}
      {isAuthOpen && <AuthModal setIsOpen={setIsAuthOpen} setEmail={setCurrentEmail} />}
      <div className='settings-topborder'>
        <div className='settings-title'>Settings</div>
      </div>
      <div className='settings-body'>

        {/* Account */}
        <div className='settings-category-container'>   
          <div className='settings-category-title'>Account</div>
          <div className='settings-item-container'>
            <div className='settings-item last-item' onClick={() => setIsAuthOpen(true)}>
              <span>{currentEmail || 'Not signed in'}</span>
              <img src={arrowPath} className='arrow'></img>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className='settings-category-container'>   
          <div className='settings-category-title'>Appearance</div>
          <div className='settings-item-container'>
            <div className='settings-item cat-color' onClick={() => setIsCatColorOpen(true)}>
              <span>Categories Colors</span>
              <img src={arrowPath} className='arrow'></img>
            </div>
            <div className='settings-item last-item' onClick={() => setIsCurrenciesOpen(true)}>
              <span>Currency Settings</span>
              <img src={arrowPath} className='arrow'></img>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className='settings-category-container'>
          <div className='settings-category-title'>Data</div>
          <div className='settings-item-container'>
            <div onClick={handleClearCache} className='settings-item'>
              <span>Clear Cache</span>
            </div>
            <div className='settings-item last-item'>
              <span>Version 1.12</span>
            </div>
          </div>
        {isNotification && 
        <CustomNotification duration={3000} setIsOpen={setIsNotification} className='settings-notification'>
          <div>Cleared Cache</div>
        </CustomNotification>}
        </div>
        
        {/* Tests */}
        <div className='settings-category-container'>   
          <div className='settings-category-title'>Tests</div>
          <div className='settings-item-container'>
            <NavLink to='/tests' className='settings-item last-item'>
              <span>Tests</span>
              <img src={arrowPath} className='arrow'></img>
            </NavLink>
          </div>
        </div>

        <div>
        </div>
      </div>
    </div>
  )
}
