import React, { useState, useEffect } from 'react';
import { BookOpen, Copy, Target, Edit3, ArrowRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

// Dades del codi de colors
const COLORS = [
  { id: 'black', name: 'Negre', hex: '#000000', text: 'white', val: 0, mult: 1, multStr: 'x1 Ω', tol: null, tolStr: '-' },
  { id: 'brown', name: 'Marró', hex: '#8B4513', text: 'white', val: 1, mult: 10, multStr: 'x10 Ω', tol: 1, tolStr: '±1%' },
  { id: 'red', name: 'Vermell', hex: '#FF0000', text: 'white', val: 2, mult: 100, multStr: 'x100 Ω', tol: 2, tolStr: '±2%' },
  { id: 'orange', name: 'Taronja', hex: '#FF8C00', text: 'black', val: 3, mult: 1000, multStr: 'x1 kΩ', tol: null, tolStr: '-' },
  { id: 'yellow', name: 'Groc', hex: '#FFD700', text: 'black', val: 4, mult: 10000, multStr: 'x10 kΩ', tol: null, tolStr: '-' },
  { id: 'green', name: 'Verd', hex: '#008000', text: 'white', val: 5, mult: 100000, multStr: 'x100 kΩ', tol: 0.5, tolStr: '±0.5%' },
  { id: 'blue', name: 'Blau', hex: '#0000FF', text: 'white', val: 6, mult: 1000000, multStr: 'x1 MΩ', tol: 0.25, tolStr: '±0.25%' },
  { id: 'violet', name: 'Violeta', hex: '#800080', text: 'white', val: 7, mult: 10000000, multStr: 'x10 MΩ', tol: 0.1, tolStr: '±0.1%' },
  { id: 'gray', name: 'Gris', hex: '#808080', text: 'white', val: 8, mult: null, multStr: '-', tol: null, tolStr: '-' },
  { id: 'white', name: 'Blanc', hex: '#FFFFFF', text: 'black', val: 9, mult: null, multStr: '-', tol: null, tolStr: '-' },
  { id: 'gold', name: 'Or', hex: '#DAA520', text: 'black', val: null, mult: 0.1, multStr: 'x0.1 Ω', tol: 5, tolStr: '±5%' },
  { id: 'silver', name: 'Argent', hex: '#C0C0C0', text: 'black', val: null, mult: 0.01, multStr: 'x0.01 Ω', tol: 10, tolStr: '±10%' }
];

// Targetes de memòria
const FLASHCARDS = [
  { q: "Quin color representa el número 0?", a: "Negre" },
  { q: "Quin valor té la primera franja si és Vermella?", a: "2" },
  { q: "Quin color representa el multiplicador x1 kΩ (x1000)?", a: "Taronja" },
  { q: "Si la quarta franja és Or, quina és la tolerància?", a: "±5%" },
  { q: "Quin color representa el número 5?", a: "Verd" },
  { q: "Quin valor té el color Blau com a xifra?", a: "6" },
  { q: "Quin color indica una tolerància del ±10%?", a: "Argent" },
  { q: "Quin color és el número 9?", a: "Blanc" },
  { q: "Quin multiplicador és el color Marró?", a: "x10 Ω" },
  { q: "Quin color és el número 4?", a: "Groc" }
];

// Components gràfics
const ResistorGraphic = ({ bands }) => {
  const defaultBg = "transparent";
  const getHex = (colorId) => COLORS.find(c => c.id === colorId)?.hex || defaultBg;

  return (
    <div className="relative flex items-center justify-center py-8">
      {/* Filferros */}
      <div className="absolute w-64 h-2 bg-gray-400 z-0"></div>
      
      {/* Cos de la resistència */}
      <div className="relative w-48 h-16 bg-[#e8c396] border-2 border-[#b58b5a] rounded-2xl z-10 flex items-center shadow-md overflow-hidden">
        {/* Franges */}
        <div className="flex-1 h-full flex items-center">
          <div className="w-6 h-full ml-4 border-r border-l border-black/10" style={{ backgroundColor: getHex(bands[0]) }}></div>
          <div className="w-6 h-full ml-3 border-r border-l border-black/10" style={{ backgroundColor: getHex(bands[1]) }}></div>
          <div className="w-6 h-full ml-3 border-r border-l border-black/10" style={{ backgroundColor: getHex(bands[2]) }}></div>
        </div>
        {/* Quarta franja (separada) */}
        <div className="w-6 h-full mr-4 border-r border-l border-black/10" style={{ backgroundColor: getHex(bands[3]) }}></div>
      </div>
    </div>
  );
};

// Funcions auxiliars
const formatResistance = (val1, val2, mult, tolId) => {
  const baseValue = (val1 * 10 + val2) * mult;
  let formattedValue = baseValue;
  let unit = "Ω";

  if (baseValue >= 1000000) {
    formattedValue = baseValue / 1000000;
    unit = "MΩ";
  } else if (baseValue >= 1000) {
    formattedValue = baseValue / 1000;
    unit = "kΩ";
  } else {
    // Arrodonim a 2 decimals per si hi ha or/argent
    formattedValue = Math.round(baseValue * 100) / 100;
  }

  const tolObj = COLORS.find(c => c.id === tolId);
  const tolStr = tolObj ? tolObj.tolStr : '';

  return `${formattedValue} ${unit} ${tolStr}`;
};

const getRandomResistor = () => {
  const digitColors = COLORS.filter(c => c.val !== null);
  const multColors = COLORS.filter(c => c.mult !== null);
  const tolColors = COLORS.filter(c => c.tol !== null && (c.id === 'gold' || c.id === 'silver' || c.id === 'brown'));

  const c1 = digitColors[Math.floor(Math.random() * 9) + 1]; // Mai comença en 0
  const c2 = digitColors[Math.floor(Math.random() * 10)];
  const mult = multColors[Math.floor(Math.random() * multColors.length)];
  const tol = tolColors[Math.floor(Math.random() * tolColors.length)];

  return {
    bands: [c1.id, c2.id, mult.id, tol.id],
    valueStr: formatResistance(c1.val, c2.val, mult.mult, tol.id)
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('learn');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Capçalera */}
      <header className="bg-blue-600 text-white p-6 shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">Codi de Colors de Resistències</h1>
        <p className="text-blue-100">Activitat interactiva per a Tecnologia (ESO)</p>
      </header>

      {/* Menú de navegació */}
      <nav className="flex flex-wrap justify-center gap-2 p-4 bg-white shadow-sm sticky top-0 z-50">
        <TabButton id="learn" icon={<BookOpen size={18}/>} label="1. Taula" active={activeTab} set={setActiveTab} />
        <TabButton id="flash" icon={<Copy size={18}/>} label="2. Memòria" active={activeTab} set={setActiveTab} />
        <TabButton id="read" icon={<Target size={18}/>} label="3. Llegeix" active={activeTab} set={setActiveTab} />
        <TabButton id="write" icon={<Edit3 size={18}/>} label="4. Escriu" active={activeTab} set={setActiveTab} />
      </nav>

      {/* Contingut principal */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
        {activeTab === 'learn' && <Phase1Learn />}
        {activeTab === 'flash' && <Phase2Flashcards />}
        {activeTab === 'read' && <Phase3Read />}
        {activeTab === 'write' && <Phase4Write />}
      </main>
    </div>
  );
}

// Components de les fases
function Phase1Learn() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-700">
        <BookOpen className="text-blue-500" /> Aprèn el Codi
      </h2>
      <p className="mb-6 text-slate-600">
        Les resistències tenen franges de colors que ens indiquen el seu valor en Ohms (Ω). 
        Les dues primeres franges formen un número de dues xifres. La tercera franja és per la quantitat que hem de multiplicar, i la quarta és el marge d'error (tolerància).
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 border-b-2 border-slate-200">Color</th>
              <th className="p-3 border-b-2 border-slate-200 text-center">1a i 2a Franja<br/>(Xifres)</th>
              <th className="p-3 border-b-2 border-slate-200 text-center">3a Franja<br/>(Multiplicador)</th>
              <th className="p-3 border-b-2 border-slate-200 text-center">4a Franja<br/>(Tolerància)</th>
            </tr>
          </thead>
          <tbody>
            {COLORS.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full border border-slate-300 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    ></div>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="p-3 text-center text-lg font-bold">{c.val !== null ? c.val : '-'}</td>
                <td className="p-3 text-center">{c.multStr}</td>
                <td className="p-3 text-center">{c.tolStr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Phase2Flashcards() {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % FLASHCARDS.length);
    }, 150);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2 text-blue-700">
        <Copy className="text-blue-500" /> Targetes de Memòria
      </h2>
      <p className="mb-8 text-slate-600">Llegeix la pregunta, pensa la resposta i clica a la targeta per girar-la.</p>

      <div 
        className={`relative w-full h-64 cursor-pointer perspective-1000 transition-transform duration-500 ${isFlipped ? 'scale-105' : 'scale-100'}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Targeta (Cara i Creu simulat de forma senzilla) */}
        <div className={`w-full h-full absolute top-0 left-0 flex items-center justify-center p-8 rounded-2xl shadow-lg border-2 ${isFlipped ? 'bg-blue-600 border-blue-700 text-white' : 'bg-blue-50 border-blue-200 text-blue-900'} transition-all duration-300`}>
          <div className="text-2xl md:text-3xl font-medium">
            {isFlipped ? FLASHCARDS[index].a : FLASHCARDS[index].q}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-slate-500 font-medium">Targeta {index + 1} de {FLASHCARDS.length}</span>
        <button 
          onClick={nextCard}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          Següent <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Phase3Read() {
  const [resistor, setResistor] = useState(getRandomResistor());
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    generateOptions(resistor);
  }, [resistor]);

  const generateOptions = (correctResistor) => {
    const newOptions = new Set([correctResistor.valueStr]);
    while (newOptions.size < 4) {
      newOptions.add(getRandomResistor().valueStr);
    }
    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5));
  };

  const handleGuess = (guess) => {
    if (feedback !== null) return; 
    
    const isCorrect = guess === resistor.valueStr;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1
    }));
  };

  const nextQuestion = () => {
    setFeedback(null);
    setResistor(getRandomResistor());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
          <Target className="text-blue-500" /> Llegeix la Resistència
        </h2>
        <ScoreBadge score={score} />
      </div>

      <p className="text-lg text-slate-600 mb-2">Quin és el valor d'aquesta resistència?</p>
      
      <ResistorGraphic bands={resistor.bands} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-xl mx-auto">
        {options.map((opt, i) => {
          let btnClass = "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300";
          if (feedback !== null) {
            if (opt === resistor.valueStr) btnClass = "bg-green-500 text-white border-green-600 shadow-lg scale-105";
            else if (feedback === 'incorrect') btnClass = "bg-red-100 text-red-400 border-red-200 opacity-50";
            else btnClass = "bg-slate-50 text-slate-400 opacity-50";
          }

          return (
            <button
              key={i}
              onClick={() => handleGuess(opt)}
              disabled={feedback !== null}
              className={`p-4 rounded-xl border-2 font-bold text-xl transition-all duration-200 ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className="mt-8 flex flex-col items-center animate-fade-in">
          <div className={`flex items-center gap-2 text-xl font-bold mb-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
            {feedback === 'correct' ? <><CheckCircle2 /> Excel·lent!</> : <><XCircle /> Oops! Era {resistor.valueStr}</>}
          </div>
          <button 
            onClick={nextQuestion}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-colors"
          >
            Següent Resistència <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

function Phase4Write() {
  const [target, setTarget] = useState(getRandomResistor());
  const [userBands, setUserBands] = useState(['', '', '', '']);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState(null);

  const checkAnswer = () => {
    if (userBands.includes('')) return;

    const isCorrect = userBands.every((band, i) => band === target.bands[i]);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1
    }));
  };

  const nextQuestion = () => {
    setFeedback(null);
    setUserBands(['', '', '', '']);
    setTarget(getRandomResistor());
  };

  const updateBand = (index, value) => {
    const newBands = [...userBands];
    newBands[index] = value;
    setUserBands(newBands);
    setFeedback(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
          <Edit3 className="text-blue-500" /> Pinta la Resistència
        </h2>
        <ScoreBadge score={score} />
      </div>

      <div className="mb-8">
        <p className="text-lg text-slate-500">Construeix una resistència de:</p>
        <p className="text-4xl font-bold text-slate-800 mt-2">{target.valueStr}</p>
      </div>

      {/* Vista prèvia en viu */}
      <ResistorGraphic bands={userBands} />

      {/* Selectors de color */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
        <ColorSelect 
          label="1a Franja (Xifra)" 
          options={COLORS.filter(c => c.val !== null)} 
          value={userBands[0]} 
          onChange={(v) => updateBand(0, v)} 
          disabled={feedback !== null}
        />
        <ColorSelect 
          label="2a Franja (Xifra)" 
          options={COLORS.filter(c => c.val !== null)} 
          value={userBands[1]} 
          onChange={(v) => updateBand(1, v)} 
          disabled={feedback !== null}
        />
        <ColorSelect 
          label="3a Franja (Multiplicador)" 
          options={COLORS.filter(c => c.mult !== null)} 
          value={userBands[2]} 
          onChange={(v) => updateBand(2, v)} 
          disabled={feedback !== null}
        />
        <ColorSelect 
          label="4a Franja (Tolerància)" 
          options={COLORS.filter(c => c.tol !== null)} 
          value={userBands[3]} 
          onChange={(v) => updateBand(3, v)} 
          disabled={feedback !== null}
        />
      </div>

      <div className="mt-8 flex flex-col items-center h-24">
        {feedback === null ? (
          <button 
            onClick={checkAnswer}
            disabled={userBands.includes('')}
            className={`px-8 py-3 rounded-xl font-bold text-lg shadow-md transition-all ${userBands.includes('') ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'}`}
          >
            Comprova-ho!
          </button>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <div className={`flex items-center gap-2 text-xl font-bold mb-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
              {feedback === 'correct' ? <><CheckCircle2 /> Perfecte!</> : <><XCircle /> Has fallat. Intenta-ho de nou!</>}
            </div>
            <button 
              onClick={feedback === 'correct' ? nextQuestion : () => setFeedback(null)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg font-bold transition-colors"
            >
              {feedback === 'correct' ? 'Següent Resistència' : 'Torna a provar'} <RotateCcw size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Components d'interfície menors
function TabButton({ id, icon, label, active, set }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => set(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all ${isActive ? 'bg-blue-100 text-blue-700 shadow-sm ring-1 ring-blue-300' : 'text-slate-600 hover:bg-slate-100'}`}
    >
      {icon} {label}
    </button>
  );
}

function ScoreBadge({ score }) {
  return (
    <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
      <span className="text-slate-500 font-medium text-sm">Puntuació: </span>
      <span className="font-bold text-blue-700 text-lg">{score.correct} <span className="text-slate-400 text-sm">/ {score.total}</span></span>
    </div>
  );
}

function ColorSelect({ label, options, value, onChange, disabled }) {
  const selectedColor = COLORS.find(c => c.id === value);

  return (
    <div className="flex flex-col text-left">
      <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
      <div className="relative">
        {selectedColor && (
          <div 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-slate-300 shadow-sm pointer-events-none"
            style={{ backgroundColor: selectedColor.hex }}
          ></div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-700 py-3 pr-8 rounded-xl outline-none focus:border-blue-500 transition-colors cursor-pointer ${value ? 'pl-10' : 'pl-4'} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <option value="" disabled>Tria un color</option>
          {options.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} {c.val !== null ? `(${c.val})` : ''} {c.mult !== null && c.val === null ? `(${c.multStr})` : ''}
            </option>
          ))}
        </select>
        {/* Icona fletxa dropdown */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
}
