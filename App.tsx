import React, { useState, useEffect } from 'react';
import { Delete, Divide, X, Minus, Plus, Equal, RotateCcw } from 'lucide-react';

interface ButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Button = ({ 
  onClick, 
  className = "", 
  children 
}: ButtonProps) => (
  <button
    onClick={onClick}
    className={`
      h-16 w-16 sm:h-20 sm:w-20 rounded-2xl text-xl sm:text-2xl font-semibold transition-all duration-200 
      active:scale-95 flex items-center justify-center shadow-sm
      ${className}
    `}
  >
    {children}
  </button>
);

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<string>('');

  const inputDigit = (digit: string) => {
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
    setHistory('');
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue && operator && !waitingForNewValue) {
      const result = performCalculation(parseFloat(prevValue), inputValue, operator);
      setDisplay(String(result));
      setPrevValue(String(result));
      setHistory(`${result} ${nextOperator}`);
    } else {
      setPrevValue(display);
      setHistory(`${display} ${nextOperator}`);
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  const performCalculation = (left: number, right: number, op: string): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right === 0 ? 0 : left / right;
      default: return right;
    }
  };

  const calculate = () => {
    if (!prevValue || !operator) return;
    
    const inputValue = parseFloat(display);
    const result = performCalculation(parseFloat(prevValue), inputValue, operator);
    
    setHistory('');
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const handleDelete = () => {
    if (waitingForNewValue) return;
    
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;

    if (/\d/.test(key)) {
      inputDigit(key);
    } else if (key === '.') {
      inputDot();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      calculate();
    } else if (key === 'Backspace') {
      handleDelete();
    } else if (key === 'Escape') {
      clear();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, prevValue, operator, waitingForNewValue]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
        
        {/* Display Screen */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 text-right">
          <div className="h-6 text-sm text-slate-400 font-medium mb-1">
            {history}
          </div>
          <div className="text-5xl font-bold text-slate-800 dark:text-white tracking-tight overflow-x-auto whitespace-nowrap scrollbar-hide">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-6 grid grid-cols-4 gap-3 sm:gap-4 bg-white dark:bg-slate-800">
          
          <Button 
            onClick={clear} 
            className="text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
          >
            AC
          </Button>
          <Button 
            onClick={handleDelete} 
            className="text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Delete className="w-6 h-6" />
          </Button>
          <Button 
            onClick={() => handleOperator('/')} 
            className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30"
          >
            <Divide className="w-6 h-6" />
          </Button>
          <Button 
            onClick={() => handleOperator('*')} 
            className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30"
          >
            <X className="w-6 h-6" />
          </Button>

          <Button onClick={() => inputDigit('7')} className="text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">7</Button>
          <Button onClick={() => inputDigit('8')} className="text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">8</Button>
          <Button onClick={() => inputDigit('9')} className="text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">9</Button>
          <Button 
            onClick={() => handleOperator('-')} 
            className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30"
          >
            <Minus className="w-6 h-6" />
          </Button>

          <Button onClick={() => inputDigit('4')} className="text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">4</Button>
          <Button onClick={() => inputDigit('5')} className="text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">5</Button>
          <Button onClick={() => inputDigit('6')} className="text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">6</Button>
          <Button 
            onClick={() => handleOperator('+')} 
            className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30"
          >
            <Plus className="w-6 h-6" />
          </Button>

          <Button onClick={() => inputDigit('1')} className="text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">1</Button>
          <Button onClick={() => inputDigit('2')} className="text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">2</Button>
          <Button onClick={() => inputDigit('3')} className="text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">3</Button>
          
          {/* Equal Button Spanning 2 Rows height roughly, but grid layout makes it side by side */}
          <button 
             onClick={calculate}
             className="row-span-2 h-full rounded-2xl text-2xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Equal className="w-8 h-8" />
          </button>

          <Button onClick={() => inputDigit('0')} className="col-span-2 w-full text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">0</Button>
          <Button onClick={inputDot} className="text-slate-700 bg-slate-50 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700">.</Button>
        </div>
      </div>
    </div>
  );
}