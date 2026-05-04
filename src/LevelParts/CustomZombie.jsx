import { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useHotkeys } from 'react-hotkeys-hook';

export default function CustomZombie({ codename, timestamp,custom }) {
  const [zombieTypes, setZombieTypes] = useState(null);
  const [zombieProps, setZombieProps] = useState(null);
  const [zombieObject, setZombieObject] = useState(null);
  const [editorValue, setEditorValue] = useState('');
  const [saveState, setSaveState] = useState({ message: '', type: '' });
  const editorRef = useRef(null);

  // Load initial data
  useEffect(() => {
    if(localStorage.getItem(custom)){
      
      const savedZombie = JSON.parse(localStorage.getItem(custom))

      setZombieTypes(savedZombie[0]);
      setZombieProps(savedZombie[1]);
      setZombieObject([savedZombie[0],savedZombie[1]]);
      
      setEditorValue(JSON.stringify(savedZombie,null,2))

      
      setSaveState({ message: `${custom} loaded from local storage`, type: 'success' });
      setTimeout(() => {
        setSaveState(prev => prev.type === 'success' ? { message: '', type: '' } : prev);
      }, 3000);
      return
    }
    const fetchData = async () => {
      try {
        const [typesResponse, propsResponse] = await Promise.all([
          fetch('/ZombieTypes.json'),
          fetch('/ZombieProps.json')
        ]);

        const typesData = await typesResponse.json();
        const propsData = await propsResponse.json();

        let types = typesData.objects.find((e) => e.aliases[0] === codename);
        const props = propsData.objects.find((e) => e.aliases[0] === codename);
        types.objdata['Properties'] = types.objdata['Properties'].replace('ZombieProps','.')
        
        setZombieTypes(types);
        setZombieProps(props);
        
        const initialObject = [types, props];
        setZombieObject(initialObject);
        setEditorValue(JSON.stringify(initialObject, null, 2));
        
      } catch (error) {
        console.error('Error fetching JSON files:', error);
        setSaveState({ message: 'Failed to load zombie data', type: 'error' });
      }
    };

    fetchData();
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editorValue);
      const pool = JSON.parse(sessionStorage.getItem('zombiePool'))
      const hotkeys = JSON.parse(localStorage.getItem('zombieHotkeyAssignments'))
      const zombieCodename = parsed[0].aliases[0]
      if (zombieCodename !== zombieObject[0].aliases[0]){
        localStorage.removeItem(zombieObject[0].aliases[0])
      }
      setZombieObject(parsed);
      
      pool.find(e=>e.timestamp === timestamp).code = zombieCodename
      Object.keys(hotkeys).forEach(e=>{
        if (hotkeys[e].timestamp === timestamp){hotkeys[e].code = zombieCodename}
      })
      localStorage.setItem('zombieHotkeyAssignments',JSON.stringify(hotkeys))
      sessionStorage.setItem('zombiePool',JSON.stringify(pool))
      
      localStorage.setItem(zombieCodename,JSON.stringify(parsed))

      if (Array.isArray(parsed) && parsed.length === 2) {
        setZombieTypes(parsed[0]);
        setZombieProps(parsed[1]);
      }

window.dispatchEvent(new CustomEvent('zombieCodenameUpdate', { 
  detail: { timestamp: timestamp }
}));
      window.dispatchEvent(new CustomEvent('hotkeyAssignmentsUpdated', { 
        detail: hotkeys 
      }));
      
      setSaveState({ message: 'Changes saved successfully!', type: 'success' });
      
      setTimeout(() => {
        setSaveState(prev => prev.type === 'success' ? { message: '', type: '' } : prev);
      }, 3000);
      
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

  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    handleSave();
  }, { enableOnFormTags: true, enableOnContentEditable: true });

  const handleEditorChange = (value) => {
    setEditorValue(value);
    if (saveState.message) {
      setSaveState({ message: '', type: '' });
    }
  };

  const getStatusBarClasses = () => {
    const baseClasses = "px-3 py-2 mb-2 rounded text-sm flex justify-between items-center transition-all duration-300 border";
    
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
          {saveState.message || 'Modify the zombie and press ctrl+s to save it'}
        </span>
        <span className="text-xs opacity-70 bg-black/20 px-1.5 py-0.5 rounded">
          ⚡ ctrl+s to Save
        </span>
      </div>
      
      <MonacoEditor
        height="700px"
        defaultLanguage="json"
        theme="vs-dark"
        value={editorValue}
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