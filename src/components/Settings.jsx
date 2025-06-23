import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import "./Settings.css";
import CategoryColors from './SettingsModals/CategoryColors';
import CustomNotification from './customs/CustomNotification';
import CurrencySettings from './SettingsModals/CurrencySettings';


export default function Settings() {
  const [isCatColorOpen, setIsCatColorOpen] = useState(false);
  const [isCurrenciesOpen, setIsCurrenciesOpen] = useState(false);
  const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);
  const [isNotification, setIsNotification] = useState(false);

  const arrowPath = "./assets/icons/left.png"

  const handleClearCache = () => {
    setCachedIcons([]);
    setIsNotification(true);
    console.log("C");
  }

  return (
    <div>
      {isCatColorOpen && <CategoryColors setIsOpen={setIsCatColorOpen} />}
      {isCurrenciesOpen && <CurrencySettings setIsOpen={setIsCurrenciesOpen} />}
      <div className='settings-topborder'>
        <div className='settings-title'>Settings</div>
      </div>
      <div className='settings-body'>

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

        <div className='settings-category-container'>
          <div className='settings-category-title'>Data</div>
          <div className='settings-item-container'>
            <div onClick={handleClearCache} className='settings-item last-item'>
              <span>Clear Cache</span>
              
            </div>
          </div>
        {isNotification && 
        <CustomNotification duration={3000} setIsOpen={setIsNotification} className='settings-notification'>
          <div>Cleared Cache</div>
        </CustomNotification>}
        </div>

      </div>
    </div>
  )
}
