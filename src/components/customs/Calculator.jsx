import React, { useEffect, useState } from 'react'
import "./Calculator.css"
import { icons } from '../constants';

export default function Calculator({ calc, setCalc, setResult, setIsCalcOpen, setToDisplay=false, display=false}) {
  const [operations, setOperations] = useState([])
  const [isOperation, setIsOperation] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const operationSymbols = ['+', '/', '*', '-']
  
  useEffect(() => {  // For the display
    if (!operationSymbols.some(op => calc.includes(op))) {  ////// HERE HERE 
      setIsOperation(false);
      setOperations([]);
    }

    setResult(calculate());  // Always return result
  }, [calc])
  
  useEffect(() => {
    if(setToDisplay) setToDisplay(isOperation ? true : false)
  }, [isOperation])

  const calculate = () => {
    let toCalc = calc

    if (toCalc === '') return;  // In case it's empty
    if (toCalc === '.') return 0;  // Handle dot .
    if (operationSymbols.includes(toCalc.at(-1)) && calc.length < 2) {return 0};  // In case it's just an operation symbol
    // if (!isOperation) return // In case the user hasn't made any math operation to calculate
    if (!toCalc) return // In case it's empty
    if (toCalc.at(-1) === '.' && operationSymbols.includes(toCalc.at(-2))) toCalc = toCalc.slice(0, -1); // In case op dot (+.)
  
    if (toCalc.at(-2) === '/' && toCalc.at(-1) === '0') toCalc = toCalc.slice(0, -1);  // Devide by 0
    if (toCalc.at(-1))
    if (operationSymbols.includes(toCalc.at(-1))) {  // Last char is already an operation symbol
      return eval(toCalc.slice(0, -1)).toFixed(2);
    }
    return eval(toCalc).toFixed(2);  // eval is not safe as fuck, but I don't care because it's just a personal app
  }

  const appendOperation = (op) => {
    setIsOperation(true);
    if (operationSymbols.includes(calc.at(-1))) {  // Last char is already an operation symbol
      setCalc(n => n.slice(0, -1) + op);
      return
    }
    if (operations.length > 0) {  // Means that there's already something to calculate
      setOperations([]);
      const res = calculate()
      setCalc(res + op)
      setOperations([op])
      return
    };
    setOperations([op])
    appendNumber(op);
  }

  const appendNumber = (num) => {
    const isValid = /^-?\d*\.?\d*(?:[+\-*/]-?\d*\.?\d*)?$/.test(calc + num);
    if (!isValid) return;
    // if (num != '.' && calc.at(-1) === 0)
    let parts = (calc).split(/([+\-*/])/);
    let newNumber = parts.at(-1);
    if (newNumber.startsWith('0.') && num !== '.') {
      setCalc(n => n + num)
    }
    else if (newNumber.startsWith('0') && num != '.') {  // Change 0 to a different number (so a number won't start with 0)
      newNumber = num;
      parts[parts.length - 1] = newNumber;
      setCalc(parts.join(''));
    }
    else setCalc(n => n + num);
  }

  const deleteNum = () => {
    setCalc(n => n.slice(0, -1));
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsCalcOpen(false);
    }, 200)
  }

  const onAnimationEnd = () => {
    if (isClosing) setIsCalcOpen(false);
  }

  return (
    <div className='calc-overlay' onClick={handleClose}>
      {/* <div className={`calc-container show`} onClick={(e) => e.stopPropagation()} onAnimationEnd={onAnimationEnd}> */}
      <div className={`calc-container ${isClosing ? 'hide' : ''}`} onClick={(e) => e.stopPropagation()}>
        {display && 
          <div className='calc-display-container'>
            <input className='calc-display' placeholder={'0.00'} value={calc} readOnly={true} style={{fontSize: isOperation ? '20px' : '30px'}}/>
            <div className='calc-display-result' style={{opacity: isOperation ? 1 : 0}}> {'='+calculate() || 'a'}</div>
          </div>
        }
        <div className='calc-keys'>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('1')}>
            <button className='calc-btn'>1</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('2')}>
            <button className='calc-btn'>2</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('3')}>
            <button className='calc-btn'>3</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendOperation('/')}>
            <button className='calc-btn op'>÷</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('4')}>
            <button className='calc-btn'>4</button> 
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('5')}>
            <button className='calc-btn'>5</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('6')}>
            <button className='calc-btn'>6</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendOperation('*')}>
            <button className='calc-btn op'>x</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('7')}>
            <button className='calc-btn'>7</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('8')}>
            <button className='calc-btn'>8</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('9')}>
            <button className='calc-btn'>9</button>
          </div>

          <div className='calc-btn-wrapper' onClick={() => appendOperation('-')}>
            <button className='calc-btn op'>—</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('.')}>
            <button className='calc-btn'>.</button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendNumber('0')}>
            <button className='calc-btn'>0</button>
          </div>
          <div className='calc-btn-wrapper' onClick={deleteNum}>
            <button className='calc-btn calc-icon-container'>
            <img className='calc-btn-icon' src={icons["Delete"]}/>
            </button>
          </div>
          <div className='calc-btn-wrapper' onClick={() => appendOperation('+')}>
            <button className='calc-btn op'>+</button>
          </div>
        </div>
      </div>
    </div>
  )
}