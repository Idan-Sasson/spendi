import React, { useEffect, useState } from 'react'
import "./Calculator.css"
import { icons } from '../constants';

export default function Calculator({ calc, setCalc, setResult, setIsCalcOpen, display=false}) {
  const [operations, setOperations] = useState([])
  const [isOperation, setIsOperation] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const operationSymbols = ['+', '/', '*', '-']
  
  useEffect(() => {  // For the display
    if (!operationSymbols.some(op => calc.includes(op))) {
      setIsOperation(false);
      setOperations([]);
    }

    setResult(calculate());  // Always return result
  }, [calc])
  
  const calculate = () => {
    let toCalc = calc

    if (toCalc === '') return;  // In case it's empty
    if (toCalc === '.') return 0;  // Handle dot .
    if (operationSymbols.includes(toCalc.at(-1)) && calc.length < 2) {console.log("h"); return 0};  // In case it's just an operation symbol
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
    if (newNumber.startsWith('0') && num != '.') {
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
          <button className='calc-btn' onClick={() => appendNumber('7')}>7</button>
          <button className='calc-btn' onClick={() => appendNumber('8')}>8</button>
          <button className='calc-btn' onClick={() => appendNumber('9')}>9</button>
          <button className='calc-btn op' onClick={() => appendOperation('/')}>÷</button>
          <button className='calc-btn' onClick={() => appendNumber('4')}>4</button> 
          <button className='calc-btn' onClick={() => appendNumber('5')}>5</button>
          <button className='calc-btn' onClick={() => appendNumber('6')}>6</button>
          <button className='calc-btn op' onClick={() => appendOperation('*')}>x</button>
          <button className='calc-btn' onClick={() => appendNumber('1')}>1</button>
          <button className='calc-btn' onClick={() => appendNumber('2')}>2</button>
          <button className='calc-btn' onClick={() => appendNumber('3')}>3</button>
          <button className='calc-btn op' onClick={() => appendOperation('-')}>—</button>
          <button className='calc-btn' onClick={() => appendNumber('.')}>.</button>
          <button className='calc-btn' onClick={() => appendNumber('0')}>0</button>
          <button className='calc-btn calc-icon-container' onClick={deleteNum}>
            <img className='calc-btn-icon' src={icons["Delete"]}/>
          </button>
          <button className='calc-btn op' onClick={() => appendOperation('+')}>+</button>
        </div>
      </div>
    </div>
  )
}