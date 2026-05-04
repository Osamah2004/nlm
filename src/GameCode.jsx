// JsonViewerModal.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import Editor from '@monaco-editor/react';

const GameCode = () => {
  const [jsonFiles, setJsonFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  // Your list of JSON files
  const FILE_LIST = [
    "ArmorFeatures.json",
    "ArmorProps.json",
    "ArmorTypes.json",
    "BoardGridMaps.json",
    "DinosaurFeatures.json",
    "DinosaurProps.json",
    "DinosaurTypes.json",
    "files.json",
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

  // Set the file list immediately when component mounts
  useEffect(() => {
    setJsonFiles(FILE_LIST);
  }, []);

  // Handle editor mount
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Fetch selected file content
  const fetchFileContent = useCallback(async (filename) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from root public folder first
      let response = await fetch(`/${filename}`);
      
      // If that fails, try /data/ folder
      if (!response.ok) {
        response = await fetch(`/data/${filename}`);
      }
      
      if (!response.ok) throw new Error('Failed to fetch file');
      
      const content = await response.json();
      setFileContent(content);
      setSelectedFile(filename);
    } catch (err) {
      console.error('Error fetching file:', err);
      setError(`Failed to load ${filename}`);
      setFileContent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Download single file
  const downloadSingleFile = useCallback(() => {
    if (!selectedFile || !fileContent) return;

    const blob = new Blob([JSON.stringify(fileContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedFile, fileContent]);

  // Download all files as zip
  const downloadAllAsZip = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const zip = new JSZip();
      let failedFiles = [];

      // Fetch and add each JSON file to zip
      for (const filename of jsonFiles) {
        try {
          // Try root folder first
          let response = await fetch(`/${filename}`);
          
          // Try /data/ folder if root fails
          if (!response.ok) {
            response = await fetch(`/data/${filename}`);
          }
          
          if (response.ok) {
            const content = await response.json();
            zip.file(filename, JSON.stringify(content, null, 2));
          } else {
            failedFiles.push(filename);
          }
        } catch (err) {
          failedFiles.push(filename);
        }
      }
      
      if (failedFiles.length > 0) {
        console.warn('Failed to fetch:', failedFiles);
      }

      // Generate and download zip
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all-json-files.zip';
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
    <div className="flex flex-col h-150 w-200 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-cyan-500 px-4 py-3 border-b rounded-t-lg">
        <h2 className="text-lg font-semibold">
          {selectedFile ? `Viewing: ${selectedFile}` : 'JSON Files Viewer'}
        </h2>
      </div>

      {/* Main content - 2 columns */}
      <div className="flex flex-1 min-h-0">
        {/* Left column - File list */}
        <div className="w-1/3 border-r overflow-y-auto p-2">
          <h3 className="font-medium mb-2 px-2 text-black">Available Files ({jsonFiles.length})</h3>
          {jsonFiles.length === 0 ? (
            <p className="text-gray-500 px-2">No JSON files found</p>
          ) : (
            <ul className="space-y-1">
              {jsonFiles.map((filename) => (
                <li key={filename}>
                  <button
                    onClick={() => fetchFileContent(filename)}
                    className={`w-full text-left cursor-pointer bg-cyan-100 px-3 text-black py-2 rounded transition-colors text-sm ${
                      selectedFile === filename
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-white'
                        : 'hover:bg-cyan-200'
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
                fontSize: 12,
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
          disabled={!selectedFile || loading}
          className={`px-4 py-2 cursor-pointer rounded transition-colors text-sm ${
            selectedFile && !loading
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Download {selectedFile || 'selected file'}
        </button>
        <button
          onClick={downloadAllAsZip}
          disabled={jsonFiles.length === 0 || loading}
          className={`px-4 py-2 cursor-pointer rounded transition-colors text-sm ${
            jsonFiles.length > 0 && !loading
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Download all as ZIP
        </button>
      </div>
    </div>
  );
};

export default GameCode;