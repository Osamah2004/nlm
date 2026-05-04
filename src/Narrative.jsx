import { useState, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const characters = ['crazydave', 'winnie','zombossicon','crazydaveicon','winnieicon'];
const actions = ['NPC_ENTER', 'SAY', 'EXCITED', 'PLAYFUL', 'TIRED', 'SPECIAL2'];

const DebouncedTextInput = ({ value: initialValue, onChange, delay = 300, placeholder = "", inputRef }) => {
  const [value, setValue] = useState(initialValue || '');
  const debounceTimer = useRef(null);
  const localRef = useRef(null);
  const ref = inputRef || localRef;

  // Load initial value from sessionStorage when component mounts
  useEffect(() => {
    if (initialValue === undefined && onChange) {
      // If no initialValue provided, we could load from sessionStorage here
      // But that's handled in the Narrative component
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (onChange) onChange(value);
    }, delay);
    return () => clearTimeout(debounceTimer.current);
  }, [value, delay, onChange]);

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-70 width-limitless p-2 border border-cyan-300 rounded focus:outline-none focus:border-cyan-500 bg-white nodrag nowheel"
    />
  );
};

const Narrative = () => {
  const [intro, setIntro] = useState([])
  const [outro, setOutro] = useState([])
  const [narrativeId, setNarrativeId] = useState(1)
  const [narrativeName, setNarrativeName] = useState('intro')
  const inputRefs = useRef({});
  const [inputValues, setInputValues] = useState({});
  const currentNarrative = narrativeName === 'intro' ? intro : outro

  // Load values when narrative or items change
  useEffect(() => {
    const newValues = {};
    currentNarrative.forEach(item => {
      const saved = sessionStorage.getItem(`${narrativeName}-${item.id}`);
      if (saved) newValues[item.id] = saved;
    });
    setInputValues(newValues);
  }, [narrativeName, currentNarrative]);
  // Load data from localStorage on mount
  useEffect(() => {
    const savedIntro = localStorage.getItem('introNarrative');
    const savedOutro = localStorage.getItem('outroNarrative');
    const savedNarrativeId = localStorage.getItem('narrativeId');
    
    if (savedIntro) setIntro(JSON.parse(savedIntro));
    if (savedOutro) setOutro(JSON.parse(savedOutro));
    if (savedNarrativeId) setNarrativeId(parseInt(savedNarrativeId));
  }, []);

  // Get the current array based on narrativeName

  // Save to localStorage whenever arrays change
  useEffect(() => {
    localStorage.setItem('introNarrative', JSON.stringify(intro))
    console.log(intro)
  }, [intro])

  useEffect(() => {
    localStorage.setItem('outroNarrative', JSON.stringify(outro))
    console.log(outro)
  }, [outro])

  // Save narrativeId to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('narrativeId', narrativeId.toString())
  }, [narrativeId])

  const addNarrative = (c, a) => {
    const newEntry = { Character: c, Action: a, id: narrativeId }
    narrativeName === 'intro' ?
      setIntro([...intro, newEntry]) :
      setOutro([...outro, newEntry]);
    setNarrativeId(narrativeId + 1)
  }

  const deleteNarrative = (id) => {
    narrativeName === 'intro' ?
    setIntro(intro.filter(item => item.id !== id)) :
    setOutro(outro.filter(item => item.id !== id))
    
    sessionStorage.removeItem(`${narrativeName}-${id}`)
  }

  const characterStyles = {
    crazydave: 'bg-amber-900',
    crazydaveicon: 'bg-amber-900',
    winnie: 'bg-red-600',
    winnieicon: 'bg-red-600',
    zombossicon: 'bg-[#6699CC]'
  }

  // Get all focusable inputs in order
  const getFocusableInputs = () => {
    const inputs = [];
    currentNarrative.forEach((item, idx) => {
      if (item.Action !== 'NPC_ENTER' && item.Action !== 'NPC_EXIT') {
        const ref = inputRefs.current[item.id];
        if (ref) inputs.push(ref);
      }
    });
    return inputs;
  }

  // Handle Tab key navigation
  useHotkeys('shift+tab', (e) => {
    e.preventDefault();
    
    const inputs = getFocusableInputs();
    if (inputs.length === 0) return;
    
    const activeElement = document.activeElement;
    const currentIndex = inputs.findIndex(input => input === activeElement);
    
    let prevIndex;
    prevIndex = currentIndex <= 0 ? inputs.length - 1 : currentIndex - 1;
    
    inputs[prevIndex]?.focus();
  }, { enableOnFormTags: true });
  
  useHotkeys('tab', (e) => {
    e.preventDefault();
    
    const inputs = getFocusableInputs();
    if (inputs.length === 0) return;
    
    const activeElement = document.activeElement;
    const currentIndex = inputs.findIndex(input => input === activeElement);
    
    let nextIndex;
    nextIndex = currentIndex >= inputs.length - 1 ? 0 : currentIndex + 1;
    
    inputs[nextIndex]?.focus();
  }, { enableOnFormTags: true });

  return (
    <div className="w-250 h-150 bg-white text-black">
      <header className="bg-cyan-500 h-10 pl-1 text-3xl font-bold">Custom Narrative</header>
      <div className="flex">
        <div className="w-100 pt-1 h-140 bg-cyan-50 space-y-1.5 *:w-full">
          <div className="*:button *:block *:p-1 *:w-full space-y-1.5">
            <button className="button" onClick={() => setNarrativeName('intro')}>intro</button>
            <button className="button" onClick={() => setNarrativeName('outro')}>outro</button>
          </div>
          <hr className="text-black"/>
          {characters.map((c, idx) => (
            <div key={idx} className="flex w-full bg-gray-100 mb-4 group">
              <p className="border-r-2 w-30 pr-2 mr-2 group-hover:bg-gray-400 transition-colors duration-300">{c}</p>
              <div className="grid grid-cols-3 gap-1 w-70">
                {actions.map(a => <button key={a} onClick={() => addNarrative(c, a)} className="button">{a}</button>)}
                <button onClick={() => addNarrative(c, 'SHOUT')} className="button col-span-1">SHOUT</button>
                <button onClick={() => addNarrative(c, 'NPC_EXIT')} className="button col-span-2">NPC_EXIT</button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-150 h-140 overflow-y-auto">
          <header className="sticky top-0 h-10 pl-4 bg-cyan-300 font-medium text-2xl">
            {narrativeName} narrative
          </header>
          {currentNarrative.length === 0 ? 
            <p className="p-4">Pick an action from a character</p> : 
            currentNarrative.map((e, idx) => {
              // Load saved text from sessionStorage for this input
              const savedText = sessionStorage.getItem(`${narrativeName}-${e.id}`) || '';
              
              return (
                <div key={idx} className="p-1 flex border-b">
                  {/* {savedText} */}
                  <div className="w-5">
                    {e.id}
                  </div>
                  <div className="w-30">
                    <p className={`p-1 rounded w-30 text-white ${characterStyles[e.Character]}`}>{e.Character}</p>
                  </div>
                  |
                  <div className="w-20">
                    {e.Action}
                  </div>
                  {e.Action !== 'NPC_ENTER' && e.Action !== 'NPC_EXIT' && (
                    // <DebouncedTextInput 
                    //   value={savedText}
                    //   inputRef={(el) => {
                    //     if (el) inputRefs.current[e.id] = el;
                    //   }}
                    //   onChange={(value) => {
                    //     sessionStorage.setItem(`${narrativeName}-${e.id}`, value)
                    //   }}
                    // />
                    <input
                      value={inputValues[e.id] || ''}
                      className="w-80 width-limitless"
                      onChange={(f) => {
                        const newValue = f.target.value;
                        setInputValues(prev => ({ ...prev, [e.id]: newValue }));
                        sessionStorage.setItem(`${narrativeName}-${e.id}`, newValue);
                      }}
                    />

                  )}
                  <button 
                    onClick={() => deleteNarrative(e.id)}
                    className={`button red p-0.5
                      ${e.Action === 'NPC_ENTER' && 'ml-auto'}
                      ${e.Action === 'NPC_EXIT' && 'ml-auto'}
                      mr-0 w-fit`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Narrative;