import { useState, useRef, useEffect } from 'react';
import './index.css';
import Icon from './assets/Icon.png';

function App() {
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const inputRef = useRef(null);

  const [currentValue, setCurrentValue ] = useState('');

  const appendCurrentValue = (value) => {
    if (finished) {
      clearAllValues();
      setFinished(false);
    }

    if (currentValue === '') {
      setCurrentValue(currentValue => currentValue + value);
      if (negative) {
        setCurrentValue(currentValue => currentValue * -1);
      }
    } else {
      if (negative && currentValue > 0) {
        setCurrentValue(currentValue => (currentValue + value) * -1);
      } else {
        setCurrentValue(currentValue => currentValue + value);
      }
    }
  }

  const [negative, setNegative] = useState(false);

  const addPositiveNegative = () => {
    if (negative) {
      setNegative(false);
    } else {
      setNegative(true);
    }

    if (currentValue !== '') {
      setCurrentValue(currentValue => currentValue * -1);
    }
  }

  const removeLastCharacter = () => {
    setCurrentValue(currentValue => currentValue.toString());
    setCurrentValue(currentValue => currentValue.slice(0, -1));
  };

  const clearCurrentValue = () => {
    setCurrentValue('');
    setNegative(false);
  }

  const clearAllValues = () => {
    setCurrentValue('');
    setFirstValue('');
    setSecondValue('');
    setOperation('');
    setNegative(false);
  }

  const [operation, setOperation] = useState('');

  const performOperation = (operator) => {
    if (currentValue === '') {
      setFirstValue(0);
    } else {
      setFirstValue(currentValue);
    }

    setOperation(operator);
    setNegative(false);
    setCurrentValue('');
    
    if (secondValue !== ''){
      setSecondValue('');
      setFinished(false);
    }
  }

  function operationSwitch(operation) {
    switch(operation) {
      case 'ADD':
        return '+';
      case 'SUBTRACT':
        return '-';
      case 'MULTIPLY':
        return '*';
      case 'DIVIDE':
        return '÷';
      default:
        return '';
    }
  }

  const [finished, setFinished] = useState(false);

  const operate = () => {
    setSecondValue(currentValue);

    const first = parseFloat(firstValue);
    const second = parseFloat(currentValue);
    let result = 0;

    switch (operation) {
      case 'ADD':
        result = first + second;
        break;
      case 'SUBTRACT':
        result = first - second;
        break;
      case 'MULTIPLY':
        result = first * second;
        break;
      case 'DIVIDE':
        if (second === 0) {
          setCurrentValue('Cannot divide by 0');
          setFinished(true);
          return;
        } else {
          result = first / second; 
        }
        break;
      default:
        return;
    }

    setCurrentValue(result.toString()); 
    setFinished(true);
    setNegative(false);
  }

  const handleKeyPress = (event) => {
    const key = event.key;
    const keyToButtonId = {
      '0': 'btn-0',
      '1': 'btn-1',
      '2': 'btn-2',
      '3': 'btn-3',
      '4': 'btn-4',
      '5': 'btn-5',
      '6': 'btn-6',
      '7': 'btn-7',
      '8': 'btn-8',
      '9': 'btn-9',
      '+': 'btn-add',
      '-': 'btn-subtract',
      '*': 'btn-multiply',
      '/': 'btn-divide',
      'Enter': 'btn-equal',
      'Backspace': 'btn-backspace',
      'Escape': 'btn-ce',
      '.': 'btn-dot'
    };

    if (keyToButtonId[key]) {
      const buttonId = keyToButtonId[key];
      const button = document.getElementById(buttonId);
      if (button) {
        if (!isNaN(key) || key === '.') {
          button.classList.add('button-pressed-numbers');
          setTimeout(() => button.classList.remove('button-pressed-numbers'), 200);
        } else {
          button.classList.add('button-pressed-operations');
          setTimeout(() => button.classList.remove('button-pressed-operations'), 200);
        }
        
      }
    }

    if (key >= '0' && key <= '9') {
      appendCurrentValue(key);
    } else if (key === '+') {
      performOperation('ADD');
    } else if (key === '-') {
      performOperation('SUBTRACT');
    } else if (key === '*') {
      performOperation('MULTIPLY');
    } else if (key === '/') {
      performOperation('DIVIDE');
    } else if (key === 'Enter') {
      operate();
    } else if (key === 'Backspace') {
      removeLastCharacter();
    } else if (key === 'Escape') {
      clearAllValues();
    } else if (key === '.') {
      appendCurrentValue('.');
    }
  };

  useEffect(() => {
    console.log('Current Value: ' + currentValue);
    console.log('First Value: ' + firstValue);
    console.log('Operation: ' + operation);
    if (inputRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [currentValue]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentValue, operation, firstValue, secondValue, finished]);

  return (
    <>
      <div className='flex items-center p-[1vw] border-b border-black'>
        <img src={Icon} className='w-[2vw] h-[2vw]'/>
        <div className='w-[1vw]'/>
        <h1 className='text-black text-[1.5vw]'>Calcellator 3000</h1>
      </div>
      
      <div className='h-[3vw]'/>

      <div className='flex w-full justify-center'>
        <div className='flex flex-col w-[80%] xl:w-[40%] p-[2vw] bg-gray-400 border-[0.05vw] border-black'>
          <div className='w-full h-[2vw] p-[0.5vw] bg-white' readonly>
            <p className='text-[1vw] text-right overflow-x-auto'>{firstValue} {operationSwitch(operation)} {secondValue}</p>
          </div>
          <input type="text" ref={inputRef} value={currentValue} className='w-full h-[4vw] p-[0.5vw] mb-[1vw] text-[3vw] text-right overflow-x-auto pointer-events-none' readonly/>
          <table className='w-full'>
            <tr className='w-full'>
              <td className='w-[25%] h-[5vw]'><button id='btn-ce' onClick={clearAllValues} className='w-full h-full text-[1.5vw] text-white bg-gray-600 hover:bg-gray-800 transition-colors duration-300'>CE</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-c' onClick={clearCurrentValue} className='w-full h-full text-[1.5vw] text-white bg-gray-600 hover:bg-gray-800 transition-colors duration-300'>C</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-backspace' onClick={removeLastCharacter} className='w-full h-full text-[1.5vw] text-white bg-gray-600 hover:bg-gray-800 transition-colors duration-300'>&lt;-</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-divide' onClick={() => performOperation('DIVIDE')} className='w-full h-full text-[1.5vw] text-white bg-gray-600 hover:bg-gray-800 transition-colors duration-300'>÷</button></td>
            </tr>
            <tr className='w-full'>
              <td className='w-[25%] h-[5vw]'><button id='btn-7' onClick={() => appendCurrentValue('7')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-700 transition-colors duration-300'>7</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-8' onClick={() => appendCurrentValue('8')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-700 transition-colors duration-300'>8</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-9' onClick={() => appendCurrentValue('9')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-700 transition-colors duration-300'>9</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-multiply' onClick={() => performOperation('MULTIPLY')} className='w-full h-full text-[1.5vw] text-white bg-gray-600 hover:bg-gray-800 transition-colors duration-300'>*</button></td>
            </tr>
            <tr className='w-full'>
              <td className='w-[25%] h-[5vw]'><button id='btn-4' onClick={() => appendCurrentValue('4')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-700 transition-colors duration-300'>4</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-5' onClick={() => appendCurrentValue('5')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-700 transition-colors duration-300'>5</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-6' onClick={() => appendCurrentValue('6')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-700 transition-colors duration-300'>6</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-subtract' onClick={() => performOperation('SUBTRACT')} className='w-full h-full text-[1.5vw] text-white bg-gray-600 hover:bg-gray-800 transition-colors duration-300'>-</button></td>
            </tr>
            <tr className='w-full'>
              <td className='w-[25%] h-[5vw]'><button id='btn-1' onClick={() => appendCurrentValue('1')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-700 transition-colors duration-300'>1</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-2' onClick={() => appendCurrentValue('2')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-700 transition-colors duration-300'>2</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-3' onClick={() => appendCurrentValue('3')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-700 transition-colors duration-300'>3</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-add' onClick={() => performOperation('ADD')} className='w-full h-full text-[1.5vw] text-white bg-gray-600 hover:bg-gray-800 transition-colors duration-300'>+</button></td>
            </tr>
            <tr className='w-full'>
              <td className='w-[25%] h-[5vw]'><button onClick={addPositiveNegative} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-800 transition-colors duration-300'>+/-</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-0' onClick={() => appendCurrentValue('0')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-800 transition-colors duration-300'>0</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-dot' onClick={() => appendCurrentValue('.')} className='w-full h-full text-[1.5vw] text-white bg-gray-500 hover:bg-gray-800 transition-colors duration-300'>.</button></td>
              <td className='w-[25%] h-[5vw]'><button id='btn-equal' onClick={operate} className='w-full h-full text-[1.5vw] text-white bg-gray-600 hover:bg-gray-800 transition-colors duration-300'>=</button></td>
            </tr>
          </table>
        </div>
      </div>
    </>
  )
}

export default App
