import React from 'react';
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import "./Settings.css";
import CategoryColors from './SettingsModals/CategoryColors';

export default function Settings() {
  const [isCatColorOpen, setIsCatColorOpen] = useState(false);
  const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);

  const arrowPath = "./assets/icons/left.png"
  return (
    <div>
      {isCatColorOpen && <CategoryColors setOpen={setIsCatColorOpen} />}
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
            <div className='settings-item last-item' onClick={() => setIsCatColorOpen(true)}>
              <span>Something else don't know now</span>
              <img src={arrowPath} className='arrow'></img>
            </div>
          </div>
        </div>

        <div className='settings-category-container'>
          <div className='settings-category-title'>Data</div>
          <div className='settings-item-container'>
            <div onClick={() => setCachedIcons([])} className='settings-item last-item'>
              <span>Clear Cache</span>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}
