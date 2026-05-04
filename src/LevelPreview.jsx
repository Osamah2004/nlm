import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import GenerateLevel from './GenerateLevel';
import NumberInput from './Inputs/NumberInput';

const LevelPreview = () => {
  const levelData = GenerateLevel();
  const [fontSize, setFontSize] = useState(Number(sessionStorage.getItem('fontSize')) || 14)
  const levelName = sessionStorage.getItem('Name') || 'blank'

  useEffect(() => {
    sessionStorage.setItem('fontSize',fontSize)
  },[fontSize])

  return (
    <>
      {levelData && (
        <div className="overflow-hidden nodrag text-black">
          <div className="bg-gray-100 space-x-4 px-3 py-1 flex">
            <span className="font-mono text-4xl bg-cyan-100 hover:bg-cyan-300 hover:shadow transition-colors duration-200">
              {levelName}.json
            </span>
            <button
            className='button px-4 text-lg'
              onClick={() => {
                const jsonString = JSON.stringify(levelData, null, 2);
                navigator.clipboard.writeText(jsonString);
              }}
            >
              Copy
            </button>
            <label htmlFor="fontSize" className='text-xl pt-1'>
              font size: <input id='fontSize' value={fontSize} min={6} onChange={(e) => setFontSize(Number(e.target.value))} type="number" />
            </label>
            <button className='button px-4 text-lg gray' onClick={() => setFontSize(6)} >smallest</button>
            <button className='button px-4 text-lg gray' onClick={() => setFontSize(12)} >small</button>
            <button className='button px-4 text-lg gray' onClick={() => setFontSize(18)} >medium</button>
            <button className='button px-4 text-lg gray' onClick={() => setFontSize(24)} >large</button>
          </div>
          <MonacoEditor
            height={'80vh'}
            width={'80rem'}
            language="json"
            theme="vs-dark"
            value={JSON.stringify(levelData, null, 2)}
            options={{
              readOnly: true,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: fontSize,
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              automaticLayout: true,
            }}
          />
        </div>
      )}
    </>
  );
};

export default LevelPreview;