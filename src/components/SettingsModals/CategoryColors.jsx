import { useEffect, useState } from 'react'
import './CategoryColors.css'
import { AppOptions, categories } from '../constants'
import { RgbaColorPicker } from 'react-colorful'

import CustomSelect from '../customs/CustomSelect'
import { convertCategories, parseRgbaString, setAlpha, setIconColor } from '../HelperFunctions'
import { useLocalStorage } from '../useLocalStorage'
import { icons } from '../constants'

export default function CategoryColors({ setIsOpen }) {
  // const catColor = useCatColor()
  const [savedCategories, setSavedCategories] = useLocalStorage("savedCategories", []);
	const [color, setColor] = useState(savedCategories["General"] || convertCategories()["General"].color);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [selectedColoredIcon, setSelectedColoredIcon] = useState(null);
  const [unparsedColor, setUnparsedColor] = useState('')
  const [isClosing, setIsClosing] = useState(false);
  // console.log(convertCategories());

  const rgbaToObj = (rgbaStr) => {
    const match = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)/);
    const [, r, g, b, a] = match;
    return {
      r: Number(r),
      g: Number(g),
      b: Number(b),
      a: Number(a)
    };
  };

  useEffect(() => {
    const activeColor = savedCategories[selectedCategory] || convertCategories()[selectedCategory].color;
    setColor(rgbaToObj(activeColor));
  }, [selectedCategory])

  useEffect(() => {
    const parsedColor = `rgba(${color['r']}, ${color['g']}, ${color['b']}, ${color['a']})`
    setUnparsedColor(parsedColor);
    if (parsedColor === convertCategories()[selectedCategory].color) {  // If the set color is equal to the default color, remove from cache
      handleRemove(selectedCategory);
      return;
    }
    setSavedCategories(prev => ({ ...prev, [selectedCategory]: parsedColor}));
  }, [color]);

  const handleRemove = (category) => {
    setSavedCategories(prev => {
    const { [category]: _, ...rest } = prev;
    return rest
    });
  }

  const handleDefault = (category) => {
    handleRemove(category);
    setColor(rgbaToObj(convertCategories()[category].color));  // Removes from local storage then changes the color picker back to default
  }

  const handleReset = () => {
    setSavedCategories({});
    setColor(rgbaToObj(convertCategories()[selectedCategory].color));  // Removes from local storage then changes the color picker back to default
  }

  const handleClose = () => {
    setIsClosing(true);
  }

  const handleAnimationEnd = () => {
    if (isClosing) setIsOpen(false)
  }

  useEffect(() => {
    setIconColor(icons[selectedCategory], parseRgbaString(unparsedColor)).then(setSelectedColoredIcon)    
  }, [selectedCategory, unparsedColor])

  return (
    <div className={`cc-overlay ${isClosing ? 'slide-out' : ''}`} style={{backgroundColor: AppOptions["backgroundColor"]}} onAnimationEnd={handleAnimationEnd}>
      <div className='settings-topborder'>
        <div className='settings-title'>Color Picker</div>
      </div>
    	<div className='settings-modal-body-wrapper'>
        <div className='cc-select-wrapper'>
				  <CustomSelect onSelect={setSelectedCategory} optionTitle={selectedCategory}
            style={{boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)', paddingBottom: '1px'}}>
						{categories.map((cat) => (
							<div key={cat.name} data-value={cat.name} className="s-option-container">
								{/* <img className="s-filter-icon" src={getIconSrc(cat.name)} /> */}
			  				<div key={cat.name} >{cat.name}</div>
							</div>
						))}
          </CustomSelect>
				<div className="cc-close" onClick={handleClose}>Save</div>
        </div>
        <div className='cc-color-picker-container'>
				  <RgbaColorPicker color={color} onChange={setColor} className='cc-color-picker'/>
        </div>

        <div className='cc-icons-container'>
          <div className='cc-icon-backborder' style={{backgroundColor: setAlpha(unparsedColor, 1)}}>
            <img className='cc-icon' src={icons[selectedCategory]} />
          </div>
          <div className='cc-icon-backborder'> 
            <img className='cc-color-icon' src={selectedColoredIcon} />
          </div>
        </div>

        <div className='cc-default' onClick={() => handleDefault(selectedCategory)}>Restore default</div>
        <div className='cc-reset' onClick={handleReset}>Reset All</div>
    	</div>
    </div>
  )
}
