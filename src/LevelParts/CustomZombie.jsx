import { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import ZombieTypes from '../assets/ZombieTypes_original.json'
import ZombieProps from '../assets/ZombieProps_original.json'

export default function CustomZombie({ codename, timestamp, custom }) {
  const [saveState, setSaveState] = useState({ message: '', type: '' });
  const editorRef = useRef(null);
  const [initialValue, setInitialValue] = useState('');
  const saveTimeoutRef = useRef(null);

  // Load initial data
  useEffect(() => {
    if(localStorage.getItem(custom)){
      const savedZombie = JSON.parse(localStorage.getItem(custom))
      setInitialValue(JSON.stringify(savedZombie,null,2))
      setSaveState({ message: `${custom} loaded from local storage`, type: 'success' });
      setTimeout(() => {
        setSaveState(prev => prev.type === 'success' ? { message: '', type: '' } : prev);
      }, 3000);
      return
    }
    let types = ZombieTypes.objects.find((e) => e.aliases[0] === codename);
    const props = ZombieProps.objects.find((e) => e.aliases[0] === codename);
    types.objdata['Properties'] = types.objdata['Properties'].replace('ZombieProps','.')
    
    const initialObject = [types, props];
    setInitialValue(JSON.stringify(initialObject, null, 2));
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleSave = () => {
    if (!editorRef.current) return;
    
    try {
      const value = editorRef.current.getValue(); // Get value directly from editor
      const parsed = JSON.parse(value);
      const pool = JSON.parse(sessionStorage.getItem('zombiePool'))
      const hotkeys = JSON.parse(localStorage.getItem('zombieHotkeyAssignments'))
      const zombieCodename = parsed[0].aliases[0]
      
      // Get previous codename from localStorage
      const prevZombieObject = localStorage.getItem(custom) ? JSON.parse(localStorage.getItem(custom)) : null;
      if (prevZombieObject && zombieCodename !== prevZombieObject[0].aliases[0]) {
        localStorage.removeItem(prevZombieObject[0].aliases[0])
      }
      
      // Update pool with new codename
      const poolItem = pool.find(e => e.timestamp === timestamp);
      if (poolItem) {
        poolItem.code = zombieCodename;
      }
      
      // Update hotkeys with new codename
      Object.keys(hotkeys).forEach(e => {
        if (hotkeys[e].timestamp === timestamp) {
          hotkeys[e].code = zombieCodename;
        }
      })
      
      // Save everything
      localStorage.setItem('zombieHotkeyAssignments', JSON.stringify(hotkeys))
      sessionStorage.setItem('zombiePool', JSON.stringify(pool))
      localStorage.setItem(zombieCodename, JSON.stringify(parsed))
      
      // Dispatch events
      window.dispatchEvent(new CustomEvent('zombieCodenameUpdate', { 
        detail: { timestamp: timestamp }
      }));
      window.dispatchEvent(new CustomEvent('hotkeyAssignmentsUpdated', { 
        detail: hotkeys 
      }));
      
      setSaveState({ message: 'Changes automatically saved.', type: 'success' });
      
      setTimeout(() => {
        setSaveState(prev => prev.type === 'success' ? { message: '', type: '' } : prev);
      }, 2000);
      
    } catch (err) {
      setSaveState({ 
        message: `JSON Error: ${err.message}`, 
        type: 'error' 
      });
      
      setTimeout(() => {
        setSaveState(prev => prev.type === 'error' ? { message: '', type: '' } : prev);
      }, 5000);
    }
  };

  const isValidJson = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleEditorChange = (value) => {
    // Just validate and update status - DON'T update any state that controls the editor
    if (isValidJson(value)) {
      setSaveState({ message: 'Valid JSON', type: '' });
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Debounced save
      saveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 750);
      
    } else {
      setSaveState({ message: 'Invalid JSON', type: 'error' });
    }
  };

  const getStatusBarClasses = () => {
    const baseClasses = "px-3 py-2 mb-2 rounded-t text-xl flex justify-between items-center transition-all duration-300 border";
    
    switch (saveState.type) {
      case 'success':
        return `${baseClasses} bg-green-900 border-green-700`;
      case 'error':
        return `${baseClasses} bg-red-900 text-red-400 border-red-700`;
      default:
        return `${baseClasses} bg-gray-800 text-gray-400 border-gray-700`;
    }
  };

  return (
    <div className="w-3xl">
      {/* Status Bar */}
      <div className={getStatusBarClasses()}>
        <span>
          {saveState.message || 'Valid JSON'}
        </span>
      </div>
      
      <MonacoEditor
        height="700px"
        defaultLanguage="json"
        theme="vs-dark"
        defaultValue={initialValue}  // Use defaultValue, NOT value
        className='nokey'
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          formatOnPaste: true,
          lineNumbers: 'on',
          formatOnType: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on'
        }}
      />
    </div>
  );
}