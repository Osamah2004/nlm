import React, { useState, useEffect } from 'react';
import GameData from "../assets/GameData.json";
import ZombieFeatures from "../assets/ZombieFeatures.json"
import CustomZombie from './CustomZombie';

  const Line = ({e}) => (
                    <div className="relative col-span-2">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300"></div>
                        <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-gray-700">{e}</span>
                      </div>
                    </div>
                    )

const ZombiePool = ({modalFunction}) => {
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [selectedZombies, setSelectedZombies] = useState([]); // Now a list instead of object

  const loadPool = () => {
    const savedPool = sessionStorage.getItem('zombiePool');
    if (savedPool) {
      try {
        const parsed = JSON.parse(savedPool);
        // Ensure it's an array
        setSelectedZombies(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        alert('Error parsing zombie pool', e);
      }
    }
  }

  // Load from sessionStorage on mount
  useEffect(() => {
    loadPool();
  }, []);

  useEffect(() => {
  const handleCodenameUpdate = () => {
    loadPool();
    // You can access the timestamp via e.detail.timestamp
  };

  window.addEventListener('zombieCodenameUpdate', handleCodenameUpdate);
  
  return () => {
    window.removeEventListener('zombieCodenameUpdate', handleCodenameUpdate);
  };
}, []);

  // Save to sessionStorage whenever selectedZombies changes
  useEffect(() => {
    sessionStorage.setItem('zombiePool', JSON.stringify(selectedZombies));
    window.dispatchEvent(new Event('zombiePoolUpdated'));
  }, [selectedZombies]);

  const handleCheckboxChange = (world, zombieCode, isChecked) => {
    localStorage.setItem('board-item',zombieCode)
    if (isChecked) {
      // Add to list
      setSelectedZombies(prev => [...prev, { world, code: zombieCode }]);
    } else {
      // Remove from list
      setSelectedZombies(prev => 
        prev.filter(z => !(z.world === world && z.code === zombieCode))
      );
    }
  };

  const removeFromPool = (world, zombieCode,timestamp) => {
    setSelectedZombies(prev => 
      prev.filter(z => !(z.world === world && z.code === zombieCode && z.timestamp === timestamp))
    );
  };

  const clearAll = () => {
    setSelectedZombies([]);
  };

  // Split worlds into 3 columns with horizontal ordering (row by row)
  const worldKeys = Object.keys(GameData);
  const numCols = 3;
  const numRows = Math.ceil(worldKeys.length / numCols);
  
  // Create a 2D array with horizontal ordering
  const grid = Array(numRows).fill().map(() => Array(numCols).fill(null));
  
  worldKeys.forEach((world, index) => {
    const row = Math.floor(index / numCols);
    const col = index % numCols;
    grid[row][col] = world;
  });



  return (
    <div className="h-150 flex">
      {/* Left Side - World Buttons (3 columns, horizontal order) */}
      <div className="w-150 max-w-150 border-r border-black bg-gray-50 overflow-y-auto">
        <h3 className="font-bold text-lg mb-4 sticky top-0 bg-gray-50 pb-2 border-b z-10">Worlds</h3>
        <div className="grid grid-cols-3 gap-2">
          {grid.map((row, rowIndex) => 
            row.map((world, colIndex) => {
              const cellIndex = rowIndex * numCols + colIndex;
              return world ? (
                <button
                  key={world}
                  onClick={() => setSelectedWorld(world)}
                  className={`w-full cursor-pointer p-2 rounded text-sm font-medium transition-colors ${
                    selectedWorld === world
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {world}
                  <span className="block text-xs opacity-75">
                    ({GameData[world].length})
                  </span>
                </button>
              ) : (
                <div key={`empty-${cellIndex}`} className="w-full" />
              );
            })
          )}
        </div>
      </div>

      {/* Middle Side - Zombie Checkboxes */}
      <div className="w-150 max-w-150 border-r border-black overflow-y-auto nowheel bg-white">
        {!selectedWorld ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a world from the left to view zombies
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg mb-4 sticky top-0 bg-white pb-2 border-b z-10">
              {selectedWorld} Zombies
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({GameData[selectedWorld].length})
              </span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {GameData[selectedWorld].map((zombieCode,i) => {
                // Check if this zombie is in the selected list
                const isChecked = selectedZombies.some(
                  z => z.world === selectedWorld && z.code === zombieCode
                );
                
                const airRaid = zombieCode == 'scapegoat' && selectedWorld == 'sky'
                const frostWinds = zombieCode == 'scapegoat' && selectedWorld === 'ice'
                const dinos = zombieCode == 'scapegoat' && selectedWorld === 'dino'
                const sandstorms = zombieCode == 'scapegoat' && selectedWorld === 'egypt'
                const rp = zombieCode == 'scapegoat' && selectedWorld === 'pirate'
                const spiderRain = zombieCode == 'scapegoat' && selectedWorld === 'future'
                const pr = zombieCode == 'scapegoat' && selectedWorld === 'lostcity'
                {if (airRaid) return <Line e={"Air Raid zombies"}/>}
                {if (frostWinds) return <Line e={"Frost winds"}/>}
                {if (dinos) return <Line e={"Dinos"}/>}
                {if (sandstorms) return <Line e={"Sand Storms"}/>}
                {if (rp) return <Line e={"Raiding Parties"}/>}
                {if (spiderRain) return <Line e={"Bot Swarms"}/>}
                {if (pr) return <Line e={"Parachute Rains"}/>}
                
                
                
                return (
                  <label 
                    key={`${selectedWorld}-${zombieCode}`}
                    className="flex items-center space-x-3 cursor-pointer group p-2 hover:bg-cyan-50 rounded"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id={`${selectedWorld}-${zombieCode}`}
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(selectedWorld, zombieCode, e.target.checked)}
                        className="sr-only"
                      />
                      <span className="select-none mr-4">{zombieCode}:</span>
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
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Right Side - Zombie Pool */}
      <div className="w-80 flex flex-col bg-gray-50">
        <div className="bg-gray-100 px-4 py-3 border-b border-black flex justify-between items-center sticky top-0">
          <span className="font-bold text-gray-800">
            Zombie Pool ({selectedZombies.length})
          </span>
          {selectedZombies.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="flex-1 nowheel overflow-y-auto p-3">
          {selectedZombies.length === 0 ? (
            <div className="text-gray-500 text-center mt-8 text-sm">
              No zombies selected.<br />Check some zombies from the middle.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedZombies.map((zombie, index) => (
                <div 
                  key={`${zombie.world}-${zombie.code}-${index}`}
                  onClick={() => localStorage.setItem('board-item',zombie.code)}
                  className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs text-gray-500 truncate">{zombie.world}</span>
                    <span className="text-sm font-mono text-gray-800 truncate">{zombie.code}</span>
                  </div>
                  {!zombie.timestamp ? <button
                    onClick={() => setSelectedZombies(prev => [...prev, { world:`Custom ${zombie.code}`, code: zombie.code,timestamp:Date.now() }])}
                    className="text-gray-500 cursor-pointer hover:text-gray-800 text-lg font-bold px-2 ml-1"
                    title="Add custom zombie"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                  </button>:
                  <button onClick={() => modalFunction && modalFunction(<CustomZombie custom={zombie.code} codename={zombie.world.slice(zombie.world.indexOf(' ') + 1)} timestamp={zombie.timestamp}/>)}
                  className="text-gray-500 cursor-pointer hover:text-gray-800 text-lg font-bold px-2 ml-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                    </svg>
                    </button>}
                  <button
                    onClick={() => removeFromPool(zombie.world, zombie.code,zombie.timestamp)}
                    className="text-red-500 cursor-pointer hover:text-red-700 text-lg font-bold px-2 ml-1"
                    title="Remove from pool"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZombiePool;