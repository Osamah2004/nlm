import { useState, useEffect } from 'react';
import NumberInput from '../Inputs/NumberInput';
import { useHotkeys } from 'react-hotkeys-hook';

export default function ZombieSpawn({ wave }) {
    const [hoveredRow, setHoveredRow] = useState(null);
    const [hotkeyAssignments, setHotkeyAssignments] = useState({});
    const [waveData, setWaveData] = useState(() => {
        // Load wave data from localStorage on init - new format
        const saved = localStorage.getItem(`wave-${wave}-data`);
        if (saved) {
            return JSON.parse(saved);
        } else {
            // Default format matching the expected structure
            return {
                "aliases": [`Wave${wave}`],
                "objclass": "SpawnZombiesJitteredWaveActionProps",
                "objdata": {
                    "Zombies": []
                }
            };
        }
    });

    // Load hotkey assignments from localStorage
    useEffect(() => {
        const loadHotkeyAssignments = () => {
            const saved = localStorage.getItem('zombieHotkeyAssignments');
            if (saved) {
                try {
                    setHotkeyAssignments(JSON.parse(saved));
                } catch (e) {
                    console.error('Error parsing hotkey assignments', e);
                }
            }
        };

        loadHotkeyAssignments();

        // Listen for updates
        const handleAssignmentsUpdate = (e) => {
            setHotkeyAssignments(e.detail);
        };
        window.addEventListener('hotkeyAssignmentsUpdated', handleAssignmentsUpdate);
        
        return () => window.removeEventListener('hotkeyAssignmentsUpdated', handleAssignmentsUpdate);
    }, []);

    // Add this useEffect in ZombieSpawn.jsx
 // Empty dependency array means this runs once on mount

    // Save wave data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(`wave-${wave}-data`, JSON.stringify(waveData));
    }, [waveData, wave]);

    // Get zombies for a specific row from the waveData structure
    const getRowZombies = (row) => {
        if (row === 6) {
            // For row 6, return zombies that don't have a Row property
            return waveData.objdata.Zombies.filter(z => !z.hasOwnProperty('Row'));
        } else {
            // For rows 1-5, return zombies with matching Row
            return waveData.objdata.Zombies.filter(z => z.Row === row);
        }
    };

    // Handle zombie spawning
    const spawnZombie = (key, row) => {
        const zombie = hotkeyAssignments[key];
        let isCustom = false
        if(zombie.timestamp){
            isCustom = true
        }
        if (!zombie) return;
        
        const newZombie = {
            "Type": `RTID(${zombie.code}@${isCustom ? 'CurrentLevel' : 'ZombieTypes'})`
        };
        
        // Only add Row property if row is not 6
        if (row !== 6) {
            newZombie.Row = row;
        }
        
        setWaveData(prev => ({
            ...prev,
            objdata: {
                ...prev.objdata,
                "Zombies": [
                    ...prev.objdata.Zombies,
                    newZombie
                ]
            }
        }));
    };

    // Remove zombie from row
    const removeZombie = (row, indexInRow) => {
        // Get all zombies in this row
        const rowZombies = getRowZombies(row);
        const zombieToRemove = rowZombies[indexInRow];
        
        // Find the actual index in the main Zombies array
        let actualIndex;
        if (row === 6) {
            // For row 6, match by Type only (no Row property)
            actualIndex = waveData.objdata.Zombies.findIndex(z => 
                z.Type === zombieToRemove.Type && !z.hasOwnProperty('Row')
            );
        } else {
            // For rows 1-5, match by Type and Row
            actualIndex = waveData.objdata.Zombies.findIndex(z => 
                z.Type === zombieToRemove.Type && z.Row === row
            );
        }
        
        if (actualIndex !== -1) {
            setWaveData(prev => ({
                ...prev,
                objdata: {
                    ...prev.objdata,
                    "Zombies": prev.objdata.Zombies.filter((_, i) => i !== actualIndex)
                }
            }));
        }
    };

    // Clear entire row
    const clearRow = (row) => {
        setWaveData(prev => ({
            ...prev,
            objdata: {
                ...prev.objdata,
                "Zombies": row === 6 
                    ? prev.objdata.Zombies.filter(z => z.hasOwnProperty('Row')) // Keep only zombies with Row property
                    : prev.objdata.Zombies.filter(z => z.Row !== row) // Remove zombies with matching Row
            }
        }));
    };

    // Hotkey handler for spawning
    useHotkeys('1,2,3,4,q,w,e,r,a,s,d,f', (e, handler) => {
        const key = handler.keys?.[0] || '';
        
        if (hoveredRow !== null) {
            if (hotkeyAssignments[key]) {
                spawnZombie(key, hoveredRow);
            } else {
                console.log(`No zombie assigned to key '${key}'`);
            }
        }
    }, { enableOnFormTags: true});

    // Fallback keydown listener for backtick
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '`' || e.key === 'Backquote') {
                e.preventDefault();
                if (hoveredRow !== null) {
                    clearRow(hoveredRow);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hoveredRow, wave]);

    // Helper function to extract zombie code from Type
    const getZombieCodeFromType = (type) => {
        return type.slice(type.indexOf('(')+1,type.indexOf('@'))
    };

// Add this inside your ZombieSpawn component, before the return statement:

// Internal component for additional inputs
// Add this inside your ZombieSpawn component, before the return statement:

// Internal component for additional inputs
const AdditionalInput = ({ label, min, defaultValue, value, onValueChange, type = 'number' }) => {
    const [localValue, setLocalValue] = useState(() => {
        if (value !== undefined) return value;
        if (defaultValue !== undefined) return defaultValue;
        return type === 'number' ? 0 : 'none';
    });

    const displayValue = value !== undefined ? value : localValue;
    
    const handleChange = (newValue) => {
        if (onValueChange) {
            onValueChange(newValue);
        } else {
            setLocalValue(newValue);
        }
    };

    if (type === 'select') {
        const jamOptions = ['none', 'jam_punk', 'jam_pop', 'jam_ballad', 'jam_rap', 'jam_metal', 'jam_8bit'];
        const displayNames = {
            'none': 'None',
            'jam_punk': 'Jam Punk',
            'jam_pop': 'Jam Pop',
            'jam_ballad': 'Jam Ballad',
            'jam_rap': 'Jam Rap',
            'jam_metal': 'Jam Metal',
            'jam_8bit': 'Jam 8bit'
        };
        
        return (
            <div className="flex p-1 group hover:bg-cyan-50 transition duration-200 py-2">
                <label className="mr-1" htmlFor={`${label}-select`}>
                    {label}:
                </label>
                <select
                    value={displayValue}
                    onChange={(e) => handleChange(e.target.value)}
                    className="bg-gray-300 mr-0 ml-auto outline-0 group-hover:border-blue-400 border-2 transition-colors duration-200 rounded-xl pl-1 border-black"
                    id={`${label}-select`}
                >
                    {jamOptions.map(option => (
                        <option value={option} key={option}>
                            {displayNames[option]}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    if (type === 'checkbox') {
        return (
            <label className="flex items-center space-x-3 cursor-pointer group p-1 hover:bg-cyan-50 rounded">
                <span className="select-none">{label}:</span>
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={displayValue}
                        onChange={(e) => handleChange(e.target.checked)}
                        className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-colors duration-200
                        ${displayValue 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'bg-white border-gray-300 group-hover:border-blue-400'
                        }`}
                    >
                        {displayValue && (
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
    }

    // Number input (default)
    return (
        <div className="flex pl-1 py-2 group hover:bg-cyan-50 transition-colors duration-200">
            <label className="mr-1">{label}:</label>
            <input
                type="number"
                value={displayValue}
                min={min}
                onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
                className="nodrag nowheel"
            />
        </div>
    );
};

// Replace your lookup state and inputLookup with:
const [lookup, setLookup] = useState(() => {
    const saved = localStorage.getItem(`wave-${wave}-lookupType`);
    return saved || 'pf';
});

const [lookupValues, setLookupValues] = useState(() => {
    const saved = localStorage.getItem(`wave-${wave}-lookupValues`);
    if (saved) return JSON.parse(saved);
    return { pf: 0, tide: -1, jam: 'none', MustKillAllToNextWave: false };
});

useEffect(() => {
    localStorage.setItem(`wave-${wave}-lookupType`, lookup);
}, [lookup, wave]);

useEffect(() => {
    localStorage.setItem(`wave-${wave}-lookupValues`, JSON.stringify(lookupValues));
}, [lookupValues, wave]);

const handleLookupValueChange = (type, newValue) => {
    setLookupValues(prev => ({ ...prev, [type]: newValue }));
};


// Then update your inputLookup to use the checkbox type:
const inputLookup = {
    pf: <AdditionalInput 
        label={`Wave ${wave} pf`} 
        min={0} 
        value={lookupValues.pf}
        onValueChange={(val) => handleLookupValueChange('pf', val)}
    />,
    tide: <AdditionalInput 
        label={`W${wave} change amount`} 
        min={-1} 
        defaultValue={-1}
        value={lookupValues.tide}
        onValueChange={(val) => handleLookupValueChange('tide', val)}
    />,
    jam: <AdditionalInput 
        label={`Wave ${wave} jam`} 
        type="select"
        value={lookupValues.jam}
        onValueChange={(val) => handleLookupValueChange('jam', val)}
    />,
    MustKillAllToNextWave: <AdditionalInput 
        label={`Must Kill All To Wave ${wave+1}`}
        type="checkbox"
        value={lookupValues.MustKillAllToNextWave}
        onValueChange={(val) => handleLookupValueChange('MustKillAllToNextWave', val)}
    />
};
    return (
        <div className="hover:h-fit">
            <header className="h-6 bg-cyan-50 space-x-1 overflow-x-auto">
                <button onClick={() => setLookup('pf')} className="button">pf</button>
                <button onClick={() => setLookup('tide')} className="button">tide change</button>
                <button onClick={() => setLookup('jam')} className="button">jam</button>
                <button onClick={() => setLookup('MustKillAllToNextWave')} className="button">MustKillAllToNextWave</button>
            </header>
            {inputLookup[lookup]}
            {[1, 2, 3, 4, 5, 6].map((rowNum) => {
                const rowZombies = getRowZombies(rowNum);
                
                return (
        <div 
            key={rowNum}
            className={`
                mt-2 p-2 rounded transition-colors cursor-pointer border
                ${hoveredRow === rowNum 
                    ? 'bg-cyan-500 text-black border-cyan-600' 
                    : 'bg-cyan-100 hover:bg-cyan-200 border-transparent hover:border-cyan-300'
                }
            `}
            onMouseEnter={() => setHoveredRow(rowNum)}
            onMouseLeave={() => setHoveredRow(null)}
        >
            <div className="flex justify-between items-center mb-1">
                <span className="font-medium">
                    {rowNum < 6 ? `Row ${rowNum}` : 'Random Row'}
                </span>
                {hoveredRow === rowNum && (
                    <span className="text-xs bg-white text-cyan-700 px-2 py-0.5 rounded">
                        Press ` to clear row
                    </span>
                )}
            </div>
            
            {/* Zombie display with two rows and horizontal scroll */}
            <div className="text-xs mt-1 overflow-x-auto pb-1 min-h-16">
                {rowZombies.length > 0 ? (
                    <div className="flex flex-col gap-1 min-w-fit">
                        {/* First row */}
                        <div className="flex gap-1">
                            {rowZombies.slice(0, Math.ceil(rowZombies.length / 2)).map((zombie, i) => {
                                const zombieCode = getZombieCodeFromType(zombie.Type);
                                // Find the hotkey for this zombie type
                                const hotkey = Object.keys(hotkeyAssignments).find(
                                    key => hotkeyAssignments[key]?.code === zombieCode
                                );
                                
                                return (
                                    <span 
                                        key={i} 
                                        className="bg-cyan-700 text-white px-2 py-0.5 rounded whitespace-nowrap inline-flex items-center gap-1"
                                        title={zombie.Type}
                                    >
                                        {hotkey && (
                                            <span className="font-mono text-xs opacity-75">{hotkey}</span>
                                        )}
                                        <span>{zombieCode}</span>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeZombie(rowNum, i);
                                            }}
                                            className="ml-1 text-white hover:text-red-200 text-xs"
                                        >
                                            ×
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                        
                        {/* Second row */}
                        {rowZombies.length > Math.ceil(rowZombies.length / 2) && (
                            <div className="flex gap-1">
                                {rowZombies.slice(Math.ceil(rowZombies.length / 2)).map((zombie, i) => {
                                    const originalIndex = i + Math.ceil(rowZombies.length / 2);
                                    const zombieCode = getZombieCodeFromType(zombie.Type);
                                    const hotkey = Object.keys(hotkeyAssignments).find(
                                        key => hotkeyAssignments[key]?.code === zombieCode
                                    );
                                    
                                    return (
                                        <span 
                                            key={i} 
                                            className="bg-cyan-700 text-white px-2 py-0.5 rounded whitespace-nowrap inline-flex items-center gap-1"
                                            title={zombie.Type}
                                        >
                                            {hotkey && (
                                                <span className="font-mono text-xs opacity-75">{hotkey}</span>
                                            )}
                                            <span>{zombieCode}</span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeZombie(rowNum, originalIndex);
                                                }}
                                                className="ml-1 text-white hover:text-red-200 text-xs"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-400 italic">No zombies</span>
                )}
            </div>
        </div>
                );
            })}
        </div>
    );
}