import { useState, useEffect, useCallback, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook';
import MonacoEditor from '@monaco-editor/react';
import events from '../assets/Events.json'

const Bin = () => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
)

const Refresh = () => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
)

const centeredClass = (e) => `flex items-center justify-center -translate-y-${e}`

const NLM = 
` ██████   █████ █████       ██████   ██████
▒▒██████ ▒▒███ ▒▒███       ▒▒██████ ██████ 
 ▒███▒███ ▒███  ▒███        ▒███▒█████▒███ 
 ▒███▒▒███▒███  ▒███        ▒███▒▒███ ▒███ 
 ▒███ ▒▒██████  ▒███        ▒███ ▒▒▒  ▒███ 
 ▒███  ▒▒█████  ▒███      █ ▒███      ▒███ 
 █████  ▒▒█████ ███████████ █████     █████
▒▒▒▒▒    ▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒     ▒▒▒▒▒ `


const helperAddAmbush = (arr,pickedAmbushesSetter) => {
    let zombiesCount = {}
    arr.forEach(e => {
        (zombiesCount[e.zombie] ??= []).push(e.column)
    })
    Object.keys(zombiesCount).forEach((e,i) => {
        const ambushId = parseInt(localStorage.getItem('ambushId'))
        localStorage.setItem(`${i+ambushId}-LowTide`,JSON.stringify({
            'objclass':'BeachStageEventZombieSpawnerProps',
            'objdata':{
                "ColumnEnd": Math.max(...zombiesCount[e]),
                "ColumnStart": Math.min(...zombiesCount[e]),
                "GroupSize": "1",
                "TimeBeforeFullSpawn": "0.5",
                "TimeBetweenGroups": "0.25",
                "WaveStartMessage": "[WARNING_LOW_TIDE]",
                "ZombieCount": zombiesCount[e].length,
                "ZombieName": e
            }
        }))
        //addTopickedambushes
    })
    pickedAmbushesSetter(Object.keys(zombiesCount).length)
}

const boardToAmbush = (codeAmbush,ambushSetter,ambushName = 'none',pickedAmbushesSetter) => {
    const boardItems = JSON.parse(localStorage.getItem('initialBoard'))
    const boardPositions = Object.keys(boardItems)
    let ambushList = []
    let columns = Array.from({length:9}).fill(-1)
    boardPositions.forEach(e => {
        boardItems[e].forEach(f => {
            ambushList.push({item:f,y:Number(e[0])+1,x:Number(e[2])+1})
            columns[Number(e[2])] = Number(e[2])
        })
    })
    columns = columns.filter(e => e !== -1)
    const columnStart = Math.min(...columns) + 1
    const columnEnd = Math.max(...columns) + 1
    let GridCounter = {}

    const SandS = (z,x,y) => ({Type:`RTID(${z}@${localStorage.getItem(z) ? "." : "ZombieTypes"})`,Style:'sandstorm',Column:x,Row:y})
    const SnowS = (z,x,y) => ({Type:`RTID(${z}@${localStorage.getItem(z) ? "." : "ZombieTypes"})`,Style:'snowstorm',Column:x,Row:y})
    const GS = (z,x,y) => ({Type:`RTID(${z}@${localStorage.getItem(z) ? "." : "ZombieTypes"})`,Column:x,Row:y})
    const mXmY = (i,x,y) => {
        GridCounter[i] = (GridCounter[i] ?? 0) + 1;
        return {mX:x-1,mY:y-1}
    }
    const type_mXmY = (z,x,y) => ({Type:z,mX:x,mY:y})

    const lowTide = (z,x) => ({zombie:z,column:x})
    const GSA = (z) => ({Type:`RTID(${z}@${localStorage.getItem(z) ? "." : "ZombieTypes"})`})
    const P = (x,y,p) => ({
        "TypeName": p.slice(p.indexOf('_')+1),
        "SpawnAnim": "grow",
        "AllowSpawnOnOtherPlants": false,
        "GridX": x,
        "GridY": y
      })
    
    switch (ambushName) {
        case 'none': alert('select an ambush');break;
        case 'FogEvent': {
                let temp = {...JSON.parse(codeAmbush)}
                let fogMatrix = Array.from({length:5}).map(
                    e => Array.from({length:9}).map(i => 0)
                )
                ambushList.forEach(e => {
                    fogMatrix[e.y - 1][e.x - 1] = 1
                })
                fogMatrix = fogMatrix.map(e => e.join(''))
                temp.objdata.Fogs[0].FogMatrix = fogMatrix
                ambushSetter(JSON.stringify(temp,null,2))
            };
            break;
        case 'SpawnPlants': {
                let temp = {...JSON.parse(codeAmbush)}
                temp.objdata.Plants = ambushList.map(e => P((e.x)-1,(e.y)-1,e.item))
                ambushSetter(JSON.stringify(temp,null,2))
            };
            break;
        case 'LowTide':
            {
                let temp = ambushList.map(e => lowTide(e.item,e.x))
                helperAddAmbush(temp,pickedAmbushesSetter)
            }
            break;
        case 'GroundSpawn':
            {
                let temp = {...JSON.parse(codeAmbush)}
                temp.objdata.Zombies = ambushList.map(e => GS(e.item,e.x,e.y))
                ambushSetter(JSON.stringify(temp,null,2))
            }
            break;
        case 'GroundSpawnAlt':
                {
                    let temp = {...JSON.parse(codeAmbush)}
                    temp.objdata.Zombies = ambushList.map(e => GSA(e.item,e.x,e.y))
                    temp.objdata.ColumnEnd = columnEnd
                    temp.objdata.ColumnStart = columnStart
                    ambushSetter(JSON.stringify(temp,null,2))
                }
                break;
        case 'Necromancy':
            {
                let temp = {...JSON.parse(codeAmbush)}
                temp.objdata.Zombies = ambushList.map(e => GSA(e.item,e.x,e.y))
                ambushSetter(JSON.stringify(temp,null,2))
            }
            break;
        case 'GravestoneSpawn':
            {
                let temp = {...JSON.parse(codeAmbush)}
                temp.objdata.SpawnPositionsPool = ambushList.map(e => mXmY(e.item,e.x,e.y))
                temp.objdata.GravestonePool = Object.keys(GridCounter).map(e => ({Type:`RTID(${e}@GridItemTypes)`,Count:GridCounter[e]}))
                ambushSetter(JSON.stringify(temp,null,2))
            }
            break;
        case 'SandstormSpecific':
            {
                let temp = {...JSON.parse(codeAmbush)}
                temp.objdata.Zombies = ambushList.map(e => SandS(e.item,e.x,e.y))
                ambushSetter(JSON.stringify(temp,null,2))
            }
            break;
        case 'SandstormColumns':
            {
                let temp = {...JSON.parse(codeAmbush)}
                temp.objdata.Zombies = ambushList.map(e => GSA(e.item,e.x,e.y))
                temp.objdata.ColumnEnd = columnEnd
                temp.objdata.ColumnStart = columnStart
                ambushSetter(JSON.stringify(temp,null,2))
            }
            break;
        case 'SnowstormSpecific':
            {
                let temp = {...JSON.parse(codeAmbush)}
                temp.objdata.Zombies = ambushList.map(e => SnowS(e.item,e.x,e.y))
                ambushSetter(JSON.stringify(temp,null,2))
            }
            break;
        case 'SnowstormColumns':
            {
                let temp = {...JSON.parse(codeAmbush)}
                temp.objdata.Zombies = ambushList.map(e => GSA(e.item,e.x,e.y))
                temp.objdata.ColumnEnd = columnEnd
                temp.objdata.ColumnStart = columnStart
                ambushSetter(JSON.stringify(temp,null,2))
            }
            break;
        case 'ParachuteRainVeteran':
            {
                let temp = {...JSON.parse(codeAmbush)}
                temp.objdata.ZombiesToBringWith = ambushList.map(e => type_mXmY(e.item,e.x,e.y))
                temp.objdata.ColumnEnd = columnEnd
                temp.objdata.ColumnStart = columnStart
                temp.objdata.SpiderCount = ambushList.length
                ambushSetter(JSON.stringify(temp,null,2))
            }
            break;
        case 'ParachuteRain':
            {
                let temp = {...JSON.parse(codeAmbush)}
                temp.objdata.ColumnEnd = columnEnd
                temp.objdata.ColumnStart = columnStart
                temp.objdata.SpiderCount = ambushList.length
                ambushSetter(JSON.stringify(temp,null,2))
            }
            break;
        case 'Path':
            {
                let temp = {...JSON.parse(codeAmbush)}
                temp.WalkingRoute.SplinePoints = ambushList.map(e =>
                    // x:(e.x * 65) + 230,y:(e.y * 77.5) + 200
                    ({
                        x:((e.x - 1) * 65) + 230,y:((e.y - 1) * 77.5) + 200
                    })
                )
                ambushSetter(JSON.stringify(temp,null,2))
            }
            break;
        default:
            alert(`Not compatible with this ambush`)
            break;
    }
}

export default function LevelEvents() {
    const [pickedAmbushes, setPickedAmbushes] = useState(JSON.parse(localStorage.getItem('pickedAmbushes')) || [])
    const [ambushId, setAmbushId] = useState(parseInt(localStorage.getItem('ambushId')) || 1)
    const [count, setCount] = useState(parseInt(sessionStorage.getItem('Wave Count')) || 10)
    const [interval, setInterval] = useState(parseInt(sessionStorage.getItem('Flag Interval')) || 5)
    const [onHoverAmbushes,setHoverAmbushes] = useState([])
    const [currentWaveIndex, setCurrentWaveIndex] = useState(null)
    
    // State for currently selected ambush (stays selected until changed)
    const [selectedAmbush, setSelectedAmbush] = useState(null)
    const [ambushCode, setAmbushCode] = useState(NLM)
    
    // Debounce timer ref
    const debounceTimerRef = useRef(null)
    
    // State for wave-to-ambushes mapping - NOW AN ARRAY
    const [waveAmbushes, setWaveAmbushes] = useState(() => {
        const waveCount = parseInt(sessionStorage.getItem('Wave Count')) || 10
        const saved = new Array(waveCount)
        for (let i = 0; i < waveCount; i++) {
            const key = `wave${i+1}-ambushes`
            const savedWave = localStorage.getItem(key)
            if (savedWave) {
                saved[i] = JSON.parse(savedWave)
            } else {
                saved[i] = []
            }
        }
        return saved
    })

    // Save function: saves key:`${ambushId}-${ambushName}` value:ambushCode to localStorage
    const saveAmbushCode = useCallback((id, name, code) => {
        if (!name) return
        const key = `${id}-${name}`
        localStorage.setItem(key, code)
    }, [])

    // Load function: reads `${ambushId}-${ambushName}` and returns it if exists
    const loadAmbushCode = useCallback((id, name) => {
        if (!name) return null
        const key = `${id}-${name}`
        const saved = localStorage.getItem(key)
        return saved
    }, [])

    // Setter function: takes monaco's text value, sets it to ambush code, and calls save function
    const setAndSaveAmbushCode = useCallback((newCode, ambush = selectedAmbush) => {
        if (!ambush) return
        
        // Validate JSON before saving
        try {
            JSON.parse(newCode)
            setAmbushCode(newCode)
            saveAmbushCode(ambush.id, ambush.ambushName, newCode)
        } catch (e) {
            console.warn('Invalid JSON, not saving:', e.message)
            // Optionally show error to user
            setAmbushCode(newCode) // Still update the editor, but don't save invalid JSON
        }
    }, [selectedAmbush, saveAmbushCode])

    // Debounced version of setAndSaveAmbushCode
    const debouncedSetAndSave = useCallback((newCode) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }
        debounceTimerRef.current = setTimeout(() => {
            setAndSaveAmbushCode(newCode)
        }, 500)
    }, [setAndSaveAmbushCode])

    // Handle editor change with debouncing
    const handleEditorChange = (value) => {
        if (!selectedAmbush) return
        debouncedSetAndSave(value)
    }

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [])

    const clearAmbushesOnWaves = () => {
        setWaveAmbushes(new Array(count).fill([]))
        setHoverAmbushes([])  // Add this line
        setCurrentWaveIndex(null)  // Add this line
        for (let i = 0; i < count; i++) {
            const key = `wave${i+1}-ambushes`
            localStorage.removeItem(key)
        }
    }

    useEffect(() => {
        if (selectedAmbush && ambushCode && ambushCode !== NLM) {
            const key = `${selectedAmbush.id}-${selectedAmbush.ambushName}`
            localStorage.setItem(key, ambushCode)
        }
    }, [ambushCode, selectedAmbush])

    const refresh = () => {
        const newCount = parseInt(sessionStorage.getItem('Wave Count')) || 10
        setCount(newCount)
        setInterval(parseInt(sessionStorage.getItem('Flag Interval')) || 5)
        
        // Adjust waveAmbushes when count changes
        setWaveAmbushes(prev => {
            const updated = [...prev]
            // Resize array if needed
            if (updated.length < newCount) {
                // Add new waves
                for (let i = updated.length; i < newCount; i++) {
                    const saved = localStorage.getItem(`wave${i+1}-ambushes`)
                    updated[i] = saved ? JSON.parse(saved) : []
                }
            } else if (updated.length > newCount) {
                // Truncate array
                updated.length = newCount
            }
            return updated
        })
    }


    const clear = () => {
        pickedAmbushes.forEach(e => localStorage.removeItem(`${e.id}-${e.ambushName}`))
        setPickedAmbushes([])
        setHoverAmbushes([])
        setCurrentWaveIndex(null)  // Add this line
        localStorage.setItem('pickedAmbushes', JSON.stringify([]))
        localStorage.setItem('ambushId',1)
        setAmbushId(1)
        setAmbushCode(NLM)
        setSelectedAmbush(null) // Clear selection when clearing ambushes
        clearAmbushesOnWaves()
    }

    const addToPickedAmbushes = (e) => {
        const temp = [...pickedAmbushes]
        if (typeof(e) == 'number'){
            for (let i = 0; i < e; i++) {
                temp.push({ id: ambushId+i, ambushName: 'LowTide' })
            }
            localStorage.setItem('ambushId', ambushId + e)
        }
        else {
            temp.push({ id: ambushId, ambushName: e })
            localStorage.setItem('ambushId', ambushId + 1)
            localStorage.setItem(`${ambushId}-${e}`, JSON.stringify(events[e]))
            setAmbushId(ambushId + 1)
        }
        localStorage.setItem('pickedAmbushes', JSON.stringify(temp))
        setPickedAmbushes(temp)
    }
    
    // Add selected ambush to a specific wave
    const addAmbushToWave = (waveIndex) => {
        if (!selectedAmbush) return // No ambush selected
        
        setWaveAmbushes(prev => {
            const currentWaveAmbushes = prev[waveIndex] || []
            
            const updated = [...prev]
            updated[waveIndex] = [...currentWaveAmbushes, selectedAmbush]
            
            // Save to localStorage
            localStorage.setItem(`wave${waveIndex+1}-ambushes`, JSON.stringify(updated[waveIndex]))
            
            return updated
        })
    }

    // Select an ambush from the picked list
    const selectAmbush = (ambush) => {
        const isSameAmbush = selectedAmbush?.id === ambush.id
        const newSelectedAmbush = isSameAmbush ? null : ambush
        
        setSelectedAmbush(newSelectedAmbush)
        
        if (newSelectedAmbush) {
            // Try to load saved code first
            const savedCode = loadAmbushCode(ambush.id, ambush.ambushName)
            
            if (savedCode) {
                // Load saved code
                const parsed = JSON.parse(savedCode)
                setAmbushCode(JSON.stringify(parsed,null,2))
            } else {
                // Load default code from events JSON
                const code = events[ambush.ambushName]
                const defaultCode = JSON.stringify(code, null, 2)
                setAmbushCode(defaultCode)
                // Save the default code immediately
                saveAmbushCode(ambush.id, ambush.ambushName, defaultCode)
            }
        } else {
            // Reset to placeholder when deselected
            setAmbushCode(NLM)
        }
    }

    // Ctrl+S hotkey to manually save
    useHotkeys('ctrl+s', (e) => {
        e.preventDefault();
        if (selectedAmbush) {
            setAndSaveAmbushCode(ambushCode)
        }
    }, { enableOnFormTags: true, enableOnContentEditable: true });

    const eventsList = Object.keys(events)
    // Add the remove function
    const removeAmbushFromWave = (waveIndex, ambushToRemove) => {
        if (waveIndex === null) return
        
        setWaveAmbushes(prev => {
            const updated = [...prev]
            const currentWaveAmbushes = updated[waveIndex] || []
            
            // Filter out the ambush to remove
            updated[waveIndex] = currentWaveAmbushes.filter(
                ambush => ambush.id !== ambushToRemove.id
            )
            
            // Save to localStorage
            localStorage.setItem(`wave${waveIndex+1}-ambushes`, JSON.stringify(updated[waveIndex]))
            
            // Update the hover state to reflect the removal
            setHoverAmbushes(updated[waveIndex])
            
            return updated
        })
    }

    const [zombiePool,setZombiePool] = useState(JSON.parse(sessionStorage.getItem('zombiePool'))?.map(e => e.code) || [])

    return (
        <div className="w-365 h-150 bg-white flex">
            {/* List of ambushes width 50 */}
            <div className="overflow-y-auto nowheel *:w-full *:block space-y-1 w-50">
                <header className="sticky top-0 h-10 p-1 bg-cyan-300 text-xl font-medium">
                    List of ambushes
                </header>
                {eventsList.map(e => {
                    return (<button key={e} className='button p-0.5' onClick={() => addToPickedAmbushes(e)}>{e}</button>)
                })}
            </div>

            {/* Picked ambushes width 75 */}
            <div className="space-y-1 overflow-y-auto nowheel w-75">
                <div className="flex w-75 sticky top-0 z-10">
                    <header className="w-11/12 h-10 p-1 bg-cyan-300 text-xl font-medium">
                        Picked ambushes
                    </header>
                    <button className='button rounded-none w-1/12 red ml-auto mr-0' onClick={() => clear()}><Bin/></button>
                </div>
                {pickedAmbushes.map(e => {
                    return (
                        <div key={e.id} className="flex">
                            <button 
                                className={`button ml-1 w-11/12 focus left-capsule`}
                                onClick={() => selectAmbush(e)}
                                >
                                {e.id > 9 ? e.id : `0${e.id}`} | {e.ambushName}
                                {selectedAmbush?.id === e.id && selectedAmbush?.ambushName == e.ambushName ? ' - deselect' : ''}
                            </button>
                            <button
                                className={`button red active-red mr-1 w-1/12 right-capsule`}
                                onClick={() => setPickedAmbushes(pickedAmbushes.filter(f => f.id !== e.id))}
                                >
                                <Bin />
                            </button>
                        </div>
                    )
                })}
            </div>
            
            {/* Ambush to waves mapping width 90*/}
            <div className="relative space-y-1 border-r border-l w-90 nowheel">
                <div className="h-80 overflow-y-auto">
                    <div className="flex">
                        <header className="w-full sticky top-0 z-10 flex h-10 p-1 bg-cyan-300 text-xl font-medium">
                            Ambush to waves mapping
                        </header>
                            <div className="flex">
                                <button title='synchronize waves' className='button gray rounded-none' onClick={() => refresh()}>
                                    <Refresh />
                                </button>
                                <button title='all ambushes from waves' className='button red rounded-none' onClick={() => clearAmbushesOnWaves()}><Bin/></button>
                            </div>
                    </div>
                {waveAmbushes.map((wave, i) => (
                    <div className="flex pl-1 mb-1">
                        <div className="flex w-11/12 overflow-y-auto">
                            <span className={`whitespace-nowrap ${(i + 1) % interval === 0 ? 'bg-red-300' : ''}`}>
                                wave {i > 8 ? i + 1 : `0${i + 1}`} |
                            </span>
                            <button 
                                className="button gray ml-1 w-70 overflow-x-auto whitespace-nowrap"
                                onClick={() => {
                                    setCurrentWaveIndex(i) // Store the current wave index
                                    if (!selectedAmbush) {
                                        setHoverAmbushes(waveAmbushes[i] || []);
                                        return;
                                    };
                                    let temp = [...waveAmbushes]
                                    temp[i] = [...(temp[i] || []), selectedAmbush]
                                    addAmbushToWave(i)
                                    setHoverAmbushes(temp[i] || []);
                                }}
                            >
                                {wave?.length > 0 
                                    ? wave.map(a => `${a.id}`).join(', ')
                                    : 'select an ambush, and press here'}
                            </button>
                        </div>
                    </div>
                ))}
                </div>
                <div className="h-70 overflow-y-auto">
                    <header className="sticky top-0 z-10 flex h-10 p-1 bg-cyan-300 text-xl font-medium">
                        {currentWaveIndex !== null ? `Ambushes to remove from Wave ${currentWaveIndex + 1}` : 'Select a wave'}
                    </header>
                    <div className={onHoverAmbushes.length > 0 ? "grid grid-cols-2 gap-1" : `h-60 ${centeredClass(5)}`}>
                        {onHoverAmbushes.length > 0 ? onHoverAmbushes.map(e => (
                            <button 
                                key={e?.id} 
                                className='button'
                                onClick={() => removeAmbushFromWave(currentWaveIndex, e)}
                            >
                                {e?.id}|{e?.ambushName}
                            </button>
                        )) : currentWaveIndex !== null ? `Wave ${currentWaveIndex + 1} doesn't have ambushes` : 'Select a wave'}
                    </div>
                </div>
            </div>

            {/* Ambush' code */}
            <div className="w-150 nodrag">
                <header className="sticky top-0 z-10 flex h-10 p-1 bg-cyan-300 text-xl font-medium">
                    {selectedAmbush ?
                        `${selectedAmbush.id} | ${selectedAmbush.ambushName}`:
                        'Pick an ambush or an event'
                    }
                    <div className="ml-auto mr-0 space-x-1">
                    <button className='button gray' onClick={() => boardToAmbush(
                                ambushCode,
                                setAmbushCode,
                                selectedAmbush?.ambushName,
                                addToPickedAmbushes)}>Board to ambush</button>
                    </div>
                </header>
                
                <MonacoEditor
                    height="560px"
                    defaultLanguage="json"
                    theme="vs-dark"
                    className='nokey'
                    value={ambushCode}
                    onChange={handleEditorChange}
                    options={{
                    minimap: { enabled: true },
                    formatOnPaste: true,
                    fontSize: 12,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    formatOnType: true,
                    automaticLayout: true,
                    scrollBeyondLastLine: false
                    }}
                />
            </div>
        </div>
    )
}
