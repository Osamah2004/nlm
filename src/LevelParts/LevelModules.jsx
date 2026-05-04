import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import SelectLists from '../assets/SelectLists.json'
import Editor from "@monaco-editor/react";

export default function LevelModules({ data }) {
  const [modules, setModules] = useState([]);
  const editorRef = useRef(null);

  // Combined configuration at the top
  const config = useMemo(() => ({
    checkboxes: [
      { label: "ZombiesDeadWinCon", isCurrentLevel: false, default: true },
      { label: "DefaultZombieWinCondition", isCurrentLevel: false, default: true },
      { label: "NewWaves", isCurrentLevel: true, default: true },
      { label: "SeedBank", isCurrentLevel: true, default: true },
      { label: "StandardIntro", isCurrentLevel: false, default: true },
    ],
    selects: [
      { 
        label: "Mowers", 
        isCurrentLevel: false, 
        options: SelectLists.mowers, 
        placeholder: "select a mower"
      },
      { 
        label: "Sundropper", 
        isCurrentLevel: false, 
        options: SelectLists.sunDroppers, 
        placeholder: "Set the sun drop speed"
      },
      // Add more selects here if needed
    ]
  }), []);

  // Initialize modules with default true checkboxes on first render
  useEffect(() => {
    const initialModules = config.checkboxes
      .filter(checkbox => checkbox.default)
      .map(checkbox => `RTID(${checkbox.label}@${checkbox.isCurrentLevel ? 'CurrentLevel' : 'LevelModules'})`);
    
    setModules(initialModules);
  }, []); // Empty dependency array - only run once

  // Update editor content when modules change
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.setValue(JSON.stringify({ Modules: modules }, null, 2));
    }
  }, [modules]);

  // Handle editor mount
  const handleEditorDidMount = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  // Memoized module operations
  const addModule = useCallback((moduleValue) => {
    setModules(prev => [...prev, moduleValue]);
  }, []);

  const removeModule = useCallback((moduleValue) => {
    setModules(prev => prev.filter(item => item !== moduleValue));
  }, []);

  // Checkbox component
  const Checkbox = useCallback(({ label, isCurrentLevel }) => {
    const moduleValue = `RTID(${label}@${isCurrentLevel ? 'CurrentLevel' : 'LevelModules'})`;
    const isChecked = modules.includes(moduleValue);

    const handleChange = (e) => {
      const newChecked = e.target.checked;
      if (newChecked) {
        addModule(moduleValue);
      } else {
        removeModule(moduleValue);
      }
    };

    return (
      <label className="flex items-center space-x-3 cursor-pointer group p-2 hover:bg-gray-50 rounded select-none">
        <div className="relative pointer-events-none">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            className="sr-only"
          />
          <div className={`w-5 h-5 border-2 rounded transition-colors duration-200
            ${isChecked 
              ? 'bg-blue-500 border-blue-500' 
              : 'bg-white border-gray-300 group-hover:border-blue-400'
            }`}
          >
            {isChecked && (
              <svg 
                className="w-4 h-4 text-white" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
          </div>
        </div>
        <span className="text-sm text-gray-700">{label}</span>
      </label>
    );
  }, [modules, addModule, removeModule]);

  // Select component
  const Select = useCallback(({ label, isCurrentLevel, options, placeholder }) => {
    // Find which option is currently selected
    const findSelectedValue = () => {
      for (const option of options) {
        if (option === 'none') continue;
        const moduleValue = `RTID(${option}@${isCurrentLevel ? 'CurrentLevel' : 'LevelModules'})`;
        if (modules.includes(moduleValue)) {
          return option;
        }
      }
      return '';
    };

    const selectedValue = findSelectedValue();

    const handleChange = (e) => {
      const newValue = e.target.value;
      
      setModules(prev => {
        // Remove all options of this select type from modules first
        const updatedModules = prev.filter(module => {
          for (const option of options) {
            if (option === 'none') continue;
            const moduleValue = `RTID(${option}@${isCurrentLevel ? 'CurrentLevel' : 'LevelModules'})`;
            if (module === moduleValue) {
              return false;
            }
          }
          return true;
        });

        // Add new value if it's valid
        if (newValue && newValue !== 'none' && newValue !== '') {
          const newModule = `RTID(${newValue}@${isCurrentLevel ? 'CurrentLevel' : 'LevelModules'})`;
          return [...updatedModules, newModule];
        }
        return updatedModules;
      });
    };

    return (
      <div className="flex m-1">
        <label className="mr-1 whitespace-nowrap select-none">
          {label}:
        </label>
        <select
          value={selectedValue}
          onChange={handleChange}
          className="bg-gray-300 nodrag outline-0 active:border-red-500 rounded-xl pl-1 border-black border flex-1"
        >
          <option value="" hidden>{placeholder || "select an item"}</option>

            <option key={'none'} value={'none'}>
              none
            </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }, [modules]);

  return (
    <div className="flex h-128">
      {/* Left side - Controls */}
      <div className="w-1/2 border-r nowheel flex flex-col h-full">
        {/* Checkboxes section - top half */}
        <div className="h-1/2 overflow-y-auto p-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 sticky top-0 bg-white py-1">Checkboxes</h3>
            {config.checkboxes.map((checkbox) => (
              <Checkbox
                key={checkbox.label}
                label={checkbox.label}
                isCurrentLevel={checkbox.isCurrentLevel}
              />
            ))}
          </div>
        </div>

        {/* Selects section - bottom half */}
        <div className="h-1/2 overflow-y-auto p-4 border-t">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 sticky top-0 bg-white py-1">Selects</h3>
            {config.selects.map((select) => (
              <Select
                key={select.label}
                label={select.label}
                isCurrentLevel={select.isCurrentLevel}
                options={select.options}
                placeholder={select.placeholder}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Monaco Editor */}
      <div className="w-xl overflow-y-auto">
        <Editor
          height="100%"
          defaultLanguage="json"
          defaultValue={JSON.stringify({ Modules: modules }, null, 2)}
          onMount={handleEditorDidMount}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            lineNumbers: "off",
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            automaticLayout: true
          }}
          theme="vs-light"
        />
      </div>
    </div>
  );
}