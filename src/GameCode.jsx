// JsonViewerModal.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import Editor from '@monaco-editor/react';
import ArmorFeatures from './assets/ArmorFeatures.json'
import ArmorProps from './assets/ArmorProps.json'
import ArmorTypes from './assets/ArmorTypes.json'
import BoardGridMaps from './assets/BoardGridMaps.json'
import DinosaurFeatures from './assets/DinosaurFeatures.json'
import DinosaurProps from './assets/DinosaurProps.json'
import DinosaurTypes from './assets/DinosaurTypes.json'
import GridItemTypes from './assets/GridItemTypes.json'
import LawnFeatures from './assets/LawnFeatures.json'
import LevelModules from './assets/LevelModules.json'
import NarrativeList from './assets/NarrativeList.json'
import PlantAlmanac from './assets/PlantAlmanac.json'
import PlantFeatures from './assets/PlantFeatures.json'
import PlantProps from './assets/PlantProps.json'
import PlantTypes from './assets/PlantTypes.json'
import PortalProps from './assets/PortalProps.json'
import PortalTypes from './assets/PortalTypes.json'
import ProjectileFeatures from './assets/ProjectileFeatures.json'
import ProjectileProps from './assets/ProjectileProps.json'
import ProjectileTypes from './assets/ProjectileTypes.json'
import PropertySheets from './assets/PropertySheets.json'
import RectangleProps from './assets/RectangleProps.json'
import StoreCommodityFeatures from './assets/StoreCommodityFeatures.json'
import TileLiquidProps from './assets/TileLiquidProps.json'
import TileLiquidsFeatures from './assets/TileLiquidsFeatures.json'
import TileProps from './assets/TileProps.json'
import TilesFeatures from './assets/TilesFeatures.json'
import TombstoneProps from './assets/TombstoneProps.json'
import TombstonesFeatures from './assets/TombstonesFeatures.json'
import TrophyFeatures from './assets/TrophyFeatures.json'
import UpgradeFeatures from './assets/UpgradeFeatures.json'
import ZombieAlmanac from './assets/ZombieAlmanac.json'
import ZombieFeatures from './assets/ZombieFeatures.json'
import ZombieProps from './assets/ZombieProps.json'
import ZombieTypes from './assets/ZombieTypes.json'

const GameCode = () => {
  const jsonFiles = [ArmorFeatures,ArmorProps,ArmorTypes,BoardGridMaps,DinosaurFeatures,DinosaurProps,DinosaurTypes,GridItemTypes,LawnFeatures,LevelModules,NarrativeList,PlantAlmanac,PlantFeatures,PlantProps,PlantTypes,PortalProps,PortalTypes,ProjectileFeatures,ProjectileProps,ProjectileTypes,PropertySheets,RectangleProps,StoreCommodityFeatures,TileLiquidProps,TileLiquidsFeatures,TileProps,TilesFeatures,TombstoneProps,TombstonesFeatures,TrophyFeatures,UpgradeFeatures,ZombieAlmanac,ZombieFeatures,ZombieProps,ZombieTypes]
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

const FILE_LIST = [
    "ArmorFeatures.json",
    "ArmorProps.json",
    "ArmorTypes.json",
    "BoardGridMaps.json",
    "DinosaurFeatures.json",
    "DinosaurProps.json",
    "DinosaurTypes.json",
    "GridItemTypes.json",
    "LawnFeatures.json",
    "LevelModules.json",
    "NarrativeList.json",
    "PlantAlmanac.json",
    "PlantFeatures.json",
    "PlantProps.json",
    "PlantTypes.json",
    "PortalProps.json",
    "PortalTypes.json",
    "ProjectileFeatures.json",
    "ProjectileProps.json",
    "ProjectileTypes.json",
    "PropertySheets.json",
    "RectangleProps.json",
    "StoreCommodityFeatures.json",
    "TileLiquidProps.json",
    "TileLiquidsFeatures.json",
    "TileProps.json",
    "TilesFeatures.json",
    "TombstoneProps.json",
    "TombstonesFeatures.json",
    "TrophyFeatures.json",
    "UpgradeFeatures.json",
    "ZombieAlmanac.json",
    "ZombieFeatures.json",
    "ZombieProps.json",
    "ZombieTypes.json"
  ];

  // Handle editor mount
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Fetch selected file content
  const fetchFileContent = file => setFileContent(file)

  // Download single file
  const downloadSingleFile = () => {
    if (!fileContent) return;

    const blob = new Blob([JSON.stringify(fileContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Download all files as zip
  const downloadAllAsZip = useCallback(async () => {
    try {
      const zip = new JSZip();
      // Fetch and add each JSON file to zip
      FILE_LIST.forEach((filename,index) => {
        zip.file(filename,JSON.stringify(jsonFiles[index],null,2))
      })

      // Generate and download zip
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'GE_JSONs.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating zip:', err);
      setError('Failed to create zip file');
    } finally {
      setLoading(false);
    }
  }, [jsonFiles]);

  return (
    <div className="flex flex-col h-250 w-350 bg-white text-black rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-cyan-500 px-4 py-3 border-b rounded-t">
        <h2 className="text-lg font-semibold">
          {selectedFile ? `Viewing: ${selectedFile}` : 'JSON Files Viewer'}
        </h2>
      </div>

      {/* Main content - 2 columns */}
      <div className="flex flex-1 min-h-0">
        {/* Left column - File list */}
        <div className="w-1/3 border-r overflow-y-auto p-2">
          {FILE_LIST.length === 0 ? (
            <p className="text-gray-500 px-2">No JSON files found</p>
          ) : (
            <ul className="space-y-1">
              {FILE_LIST.map((filename,index) => (
                <li key={filename}>
                  <button
                    onClick={() => {
                        fetchFileContent(jsonFiles[index]);
                        setSelectedFile(filename)
                    }}
                    className={`button w-full p-1 text-lg ${
                      selectedFile === filename
                        ? 'gray'
                        : ''
                    }`}
                  >
                    {filename}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right column - Monaco Editor */}
        <div className="w-2/3 h-full">
          {loading && selectedFile ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p>Loading content...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-red-500 p-4 bg-red-50 rounded border border-red-200">
                {error}
              </div>
            </div>
          ) : fileContent ? (
            <Editor
              height="100%"
              defaultLanguage="json"
              value={JSON.stringify(fileContent, null, 2)}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: true },
                fontSize: 20,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
              onMount={handleEditorDidMount}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a file to view its content
            </div>
          )}
        </div>
      </div>

      {/* Footer with download buttons */}
      <div className="bg-gray-100 px-4 py-3 border-t rounded-b-lg flex justify-end space-x-3">
        <button
          onClick={downloadSingleFile}
          disabled={!fileContent}
          className={`px-4 text-lg button`}
        >
          Download {selectedFile || 'selected file'}
        </button>
        <button
          onClick={downloadAllAsZip}
          disabled={jsonFiles.length === 0 || loading}
          className={`px-4 text-lg button gray`}
        >
          Download all as ZIP
        </button>
      </div>
    </div>
  );
};

export default GameCode;