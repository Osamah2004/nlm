import TextInput from "../Inputs/TextInput";
import PlantList from "./PlantList";
import MonacoEditor from '@monaco-editor/react';
import { useEffect, useRef, useState } from "react";

const parsedLocal = (key) => JSON.parse(localStorage.getItem(key))
const setLocal = (key,val) => localStorage.setItem(key,JSON.stringify(val))

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

const isValidJson = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

const Conveyor = () => {
    const [plantPool,setPlantPool] = useState(parsedLocal('conveyor-pool') || [])
    const [statePlantList,setPlantList] = useState(PlantList)
    const [v,setV] = useState('')
    const [isInitialPlantsOpen,setInitialPlantsOpen] = useState(false)
    const [initialPlantsArray,setInitialPlantsArray] = useState(
        parsedLocal('conveyor')?.[0].objdata.InitialPlantList.map(e => e.PlantType) || [])
    const [wave,setWave] = useState(Number(sessionStorage.getItem('Wave Count') || 10))
    const [selectedWave,setSelectedWave] = useState(null)
    const [customPlants,setCustomPlants] = useState(JSON.parse(localStorage.getItem('customPlants')) || [])
    const [plantPoolText,setPoolText] = useState('Plant pool')
    const [isInvalidJson,setIsInvalidJson] = useState(false)
    const [conveyorArray,setConveyorArray] = useState(parsedLocal('conveyor') || [
    {
        "aliases": [
        "Conveyor"
        ],
        "objclass": "ConveyorSeedBankProperties",
        "objdata": {
        "DropDelayConditions": [
            {
            "MaxPackets": 0,
            "Delay": 4
            }
        ],
        "SpeedConditions": [],
        "InitialPlantList": []
        }
    }
    ])
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    }

    const resetConveyor = () => {
        const newConveyor = [{
            "aliases": ["Conveyor"],
            "objclass": "ConveyorSeedBankProperties",
            "objdata": {
                "DropDelayConditions": [
                    {
                    "MaxPackets": 0,
                    "Delay": 4
                    }
                ],
                "SpeedConditions": [],
                "InitialPlantList": []
            }
        }];
        setConveyorArray(newConveyor);
        localStorage.removeItem('conveyor');
        setInitialPlantsArray([]);
        setPlantPool([]);
        setIsInvalidJson(false);
        
        // Force update the editor
        if (editorRef.current) {
            editorRef.current.setValue(JSON.stringify(newConveyor, null, 2));
        }
    }

    useEffect(() => {
        localStorage.setItem('conveyor',JSON.stringify(conveyorArray))
    },[conveyorArray])

    useEffect(() => {
        setPoolText(isInitialPlantsOpen ? "Add plants to initial plants" : "Plant pool")
    },[isInitialPlantsOpen])

    const forceBoost = (key,checked) => {
        let temp = [...conveyorArray]
        temp[0].objdata.InitialPlantList[
            temp[0].objdata.InitialPlantList.findIndex(e => e.PlantType === key)
        ].ForceBoosted = checked
        setConveyorArray(temp)
    }

    const otherConveyorStats = (plant,key,value) => {
        let temp = [...conveyorArray]
        temp[0].objdata.InitialPlantList[
            temp[0].objdata.InitialPlantList.findIndex(e => e.PlantType === plant)
        ][key] = Number(value)
        if (value == -1) delete temp[0].objdata.InitialPlantList[temp[0].objdata.InitialPlantList.findIndex(e => e.PlantType === plant)][key];
        setConveyorArray(temp)
    }

    useEffect(() => {
        if (v.length > 0) {
            setPlantList(statePlantList.filter(e => e.includes(v)))
        }
        else setPlantList(PlantList)
    },[v])

    useEffect(() => {
        setLocal('conveyor-pool',plantPool)
    },[plantPool])

    // add to plant pool
    const addToPlantPool = (e) => {
        if (!plantPool.includes(e)){
            setPlantPool([...plantPool,e])
        }
        else setPlantPool(plantPool.filter(f => f !== e))
    }

    // plant pool click
    const handlePlantPoolClick = e => {
        initialPlantsArray.includes(e) ?
            setInitialPlantsArray(initialPlantsArray.filter(f => f !== e)) :
            setInitialPlantsArray([...initialPlantsArray,e]);
    }

    const isInInitial = e => initialPlantsArray.includes(e);

    useEffect(() => {
        let temp = [...conveyorArray];
        temp[0].objdata.InitialPlantList = initialPlantsArray.map(e => ({
            "PlantType": e,
            "Weight": 5
          }))
        setConveyorArray(temp);
    }, [initialPlantsArray]); // Also add plantPool if needed

    const initialSpeed = (e,i) => {
        e = Number(e)
        let temp = [...conveyorArray]
        if (temp[0].objdata.SpeedConditions.length === 0) {
            temp[0].objdata.SpeedConditions.push({MaxPackets:i,Speed:e})
            setConveyorArray(temp)
            return
        }
        let index = temp[0].objdata.SpeedConditions.findIndex(f => f.MaxPackets === i)
        if (index === -1) temp[0].objdata.SpeedConditions.push({MaxPackets:i,Speed:e})
        else temp[0].objdata.SpeedConditions[index] = {MaxPackets:i,Speed:e}
        if (e == 0) temp[0].objdata.SpeedConditions = temp[0].objdata.SpeedConditions.filter(f => f.MaxPackets !== i)
        setConveyorArray(temp)
    }

    const initialDelay = (e,i) => {
        e = Number(e)
        let temp = [...conveyorArray]
        if (temp[0].objdata.DropDelayConditions.length === 0) {
            temp[0].objdata.DropDelayConditions.push({MaxPackets:i,Delay:e})
            setConveyorArray(temp)
            return
        }
        let index = temp[0].objdata.DropDelayConditions.findIndex(f => f.MaxPackets === i)
        if (index === -1) temp[0].objdata.DropDelayConditions.push({MaxPackets:i,Delay:e})
        else temp[0].objdata.DropDelayConditions[index] = {MaxPackets:i,Delay:e}
        if (e == 0) temp[0].objdata.DropDelayConditions = temp[0].objdata.DropDelayConditions.filter(f => f.MaxPackets !== i)
        setConveyorArray(temp)
    }

    const modifyWave = (plant, wave, type) => {
        wave = Number(wave)
        let temp = [...conveyorArray]
        let index = temp.findIndex(e => e.aliases[0] === `conveyor-${wave}`)
        const arrayKey = type === 'add' ? 'Add' : 'Remove'

        const plantObject = type === 'add' ? {
            "MaxCount": 5,
            "MaxCountCooldownSeconds": 5,
            "MaxDelivered": 5,
            "MaxWeightFactor": 5,
            "Type": `RTID(${plant}@PlantTypes)`,
            "Weight": 50
        } : { "Type": `RTID(${plant}@PlantTypes)` }
        
        // Helper function to check if plant object exists in array
        const findPlantIndex = (arr, plantName) => {
            return arr.findIndex(item => item.Type === `RTID(${plantName}@PlantTypes)`)
        }
        
        if (index === -1) {
            temp.push({
                'aliases': [`conveyor-${wave}`],
                'objclass': 'ModifyConveyorWaveActionProps',
                'objdata': { [arrayKey]: [plantObject] }
            })
        } else {
            if (!temp[index].objdata[arrayKey]) {
                temp[index].objdata[arrayKey] = []
            }
            
            const plantIndex = findPlantIndex(temp[index].objdata[arrayKey], plant)
            
            if (plantIndex !== -1) {
                // Remove the plant object
                temp[index].objdata[arrayKey].splice(plantIndex, 1)
            } else {
                // Add the plant object
                temp[index].objdata[arrayKey].push(plantObject)
            }
        }
        
        // Remove only if BOTH Add and Remove are empty AND it's not index 0
        temp = temp.filter((f, idx) => {
            // Keep index 0 (the main Conveyor object)
            if (idx === 0) return true
            
            const hasAdd = f.objdata.Add?.length > 0
            const hasRemove = f.objdata.Remove?.length > 0
            return hasAdd || hasRemove
        })
        setConveyorArray(temp)
    }

    const addToWave = (plant, wave) => modifyWave(plant, wave, 'add')
    const removeFromWave = (plant, wave) => modifyWave(plant, wave, 'remove')

    

    const handleEditorChange = (value) => {
        if (isValidJson(value)) {
            localStorage.setItem(`conveyor`,value)
            setIsInvalidJson(false)
        }
        else setIsInvalidJson(true)
    }

    return (
        <div className="w-275 h-125 flex">
            {/* List of plants */}
            <div className="w-50 border-r h-full nowheel overflow-y-auto overflow-x-hidden">
                <header className="sticky top-0 p-1 bg-cyan-300">
                    <span className="text-xl font-medium">List of plants</span>
                    <label htmlFor="conveyor-filter" className=" block w-full group">
                        search: 
                        <input onChange={(e) => setV(e.target.value)} type="text" className="nodrag transition-colors duration-300" id="conveyor-filter" />
                    </label>
                </header>
                <div className="*:block *:w-full space-y-1">
                    <button className="button gray" onClick={() => setCustomPlants(JSON.parse(localStorage.getItem('customPlants')))}>fetch custom plants</button>
                    { customPlants?.map(e =>  <button className={plantPool.find(f => f == e) ? 'button red' : 'button'} onClick={() => addToPlantPool(e)}>{e}</button>)}
                    {statePlantList.map(e => <button className={plantPool.find(f => f == e) ? 'button red' : 'button'} onClick={() => addToPlantPool(e)}>{e}</button>)}
                </div>
            </div>

            {/* Plant pool + conveyor settings */}
            <div className="w-125  overflow-y-auto border-r h-full nowheel ">
                <div className="h-35 overflow-y-auto">
                    <div className="flex">
                        <header className="sticky top-0 w-18/19 p-1 bg-cyan-300 text-xl font-medium overflow-y-auto overflow-x-hidden">
                            {plantPoolText}
                        </header>
                        <button title="clear plant pool" className='button w-1/19 rounded-none red ml-auto mr-0' onClick={() => {
                            setPlantPool([])
                        }}><Bin/></button>
                    </div>
                    
                        {plantPool.length > 0 ? 
                            (
                            <div className="grid grid-cols-3 gap-1 p-0.5">
                                {plantPool.map(e => 
                                <div className="flex w-full">
                                    <button title={`Add ${e} to plant pool`} className={`button w-full ${isInInitial(e) ? '' : 'gray'}`}
                                    onClick={() => handlePlantPoolClick(e)}>{e}</button>
                                    <button onClick={() => setPlantPool(plantPool.filter(f => f !== e))} title={`Remove ${e} from plant pool`} className="text-left text-white cursor-pointer rounded-tr rounded-br
                                    transition-colors bg-red-600 hover:bg-red-800"><Bin/></button>
                                </div>
                                )}
                            </div>
                        ) : (
                                <div className="ml-[50%] mt-[10%] -translate-x-1/3">
                                    Empty plant pool
                                </div>)}
                    
                </div>
                <header className="sticky top-0 p-1 bg-cyan-300 text-xl font-medium">Conveyor settings</header>

                    {/* Initial plants */}
                    <details open={isInitialPlantsOpen} className='bg-cyan-50 my-2 cursor-pointer transition-colors w-full'>
                        <summary className='cursor-pointer p-1 font-semibold text-gray-800 hover:bg-cyan-500 transition-colors duration-300'>
                            Initial plants
                        </summary>
                        {initialPlantsArray.length > 0 ?
                        (
                            <div className="">
                                {initialPlantsArray.map(e => (
                                    <div className="w-full">
                                    <header className="bg-cyan-400 flex w-full text-center items-center justify-between">
                                        <div className="w-10"></div> {/* Spacer with fixed width */}
                                        <span>{e}</span>
                                        <button 
                                            title={`Remove ${e} from InitialPlantList.`} 
                                            className='button red' 
                                            onClick={() => setInitialPlantsArray(initialPlantsArray.filter(f => f !== e))}
                                        >
                                            <Bin/>
                                        </button>
                                    </header>
                                        <div className="flex">
                                            <label className="border-r text-center">boost:<input onChange={(f) => forceBoost(e,f.target.checked)} type="checkbox"    className="no-group checkbox"/></label>
                                            <label className="border-r text-center">count:<input min={-1}  type="number"      onChange={(f) => otherConveyorStats(e,'MaxCount',f.target.value)} className="no-group w-7/10 nodrag"/></label>
                                            <label className="border-r text-center">cooldown:<input min={-1}  type="number"   onChange={(f) => otherConveyorStats(e,'MaxCountCooldownSeconds',f.target.value)} className="no-group w-7/10 nodrag"/></label>
                                            <label className="border-r text-center">deliver:<input min={-1}  type="number"    onChange={(f) => otherConveyorStats(e,'MaxDelivered',f.target.value)} className="no-group w-7/10 nodrag"/></label>
                                            <label className="border-r text-center">factor:<input min={-1}  type="number"     onChange={(f) => otherConveyorStats(e,'MaxWeightFactor',f.target.value)} className="no-group w-7/10 nodrag"/></label>
                                            <label className="text-center">weight:<input min={1} defaultValue={5} type="number"              onChange={(f) => otherConveyorStats(e,'Weight',f.target.value)} className="no-group w-7/10 nodrag"/></label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                        : 'Pick a plant from the Plant pool'}
                    </details>

                    {/* Drop delay and speed conditions */}
                    <details className='bg-cyan-50 pb-0.5 mb-2 cursor-pointer transition-colors w-full'>
                        <summary className='cursor-pointer p-1 font-semibold text-gray-800 hover:bg-cyan-500 transition-colors duration-300'>
                            Drop delay + Speed condition
                        </summary>
                        {Array.from({length:10}).map((_,i) => {
                            return (
                            <div className="group ml-[20%] my-0.5 flex">
                                <span className="border transition-colors duration-300 group-hover:bg-cyan-600 group-hover:text-white p-1 rounded-bl-xl rounded-tl-xl">
                                    MaxPackets:{i}
                                </span>
                                <label htmlFor={`packet-${i}-speed`} className="border border-l-0">speed:
                                    <input onChange={(e) => initialSpeed(e.target.value,i)} min={0} type="number" step={10} defaultValue={0} id={`packet-${i}-speed`} className="w-12 nodrag translate-y-0.5 no-group" />
                                </label>
                                <label htmlFor={`packet-${i}-delay`} className="border border-l-0 pr-0.5 rounded-tr-xl rounded-br-xl">delay:
                                    <input onChange={(e) => initialDelay(e.target.value,i)} min={0} type="number" step={1} defaultValue={0} id={`packet-${i}-delay`} className="w-12 nodrag translate-y-0.5 no-group" />
                                </label>
                            </div>
                            )
                        })}
                    </details>


                    {/* Conveyor modification */}
                    <details onToggle={() => setWave(Number(sessionStorage.getItem('Wave Count') || 10))} className='bg-cyan-50 cursor-pointer transition-colors w-full'>
                        <summary className='cursor-pointer p-1 font-semibold text-gray-800 hover:bg-cyan-500 transition-colors duration-300'>
                            Conveyor modification
                        </summary>
                        <header className="bg-cyan-300">Selected wave: {selectedWave}</header>
                        <div className="flex">
                            <div className="w-3/12 h-44.5 overflow-y-auto space-y-1">
                                {Array.from({length:wave}).map((_,i) => {
                                const waveNumber = i + 1;
                                const isConfigured = conveyorArray.some(f => {
                                    const match = f.aliases[0]?.match(/conveyor-(\d+)/);
                                    return match && parseInt(match[1]) === waveNumber;
                                });
                                
                                return (
                                    <button 
                                    key={waveNumber}
                                    className={`button block w-full ${isConfigured ? 'gray' : ''}`} 
                                    onClick={() => setSelectedWave(waveNumber)}
                                    >
                                    Wave: {waveNumber}
                                    </button>
                                );
                                })}
                            </div>
                            <div className="w-9/12">
                                <header className="bg-cyan-400">Add/remove from wave: {selectedWave}</header>
                                {
                                    selectedWave ? 
                                        <div className="w-full flex h-38.5">
                                            <div className="w-1/2 block text-center h-full overflow-y-auto border-r space-y-1">
                                                <header className="w-full sticky top-0 cursor-pointer bg-green-200">add</header>
                                                {/* {modifications?.[`add-${wave}`]?.map(e => <p>{e}</p>)} */}
{plantPool.map(plant => {
  const conveyorIndex = conveyorArray.findIndex(f => f.aliases[0] === `conveyor-${selectedWave}`);
const isInConveyor = conveyorArray[conveyorIndex]?.objdata?.Add?.some(
    item => item.Type === `RTID(${plant}@PlantTypes)`
  );
  
  return (
    <button 
      key={plant}
      onClick={() => addToWave(plant, selectedWave)} 
      className={`w-full block button text-center ${isInConveyor ? 'red' : ''}`}
    >
      {plant}
    </button>
  );
})}
                                            </div>
                                            <div className="w-1/2 block text-center h-full overflow-y-auto  space-y-1">
                                                <header className="w-full sticky top-0 cursor-pointer bg-red-200">remove</header>
                                                {/* {modifications?.[`remove-${wave}`]?.map(e => <p>{e}</p>)} */}
{plantPool.map(plant => {
  const conveyorIndex = conveyorArray.findIndex(f => f.aliases[0] === `conveyor-${selectedWave}`);
  const isInRemove = conveyorArray[conveyorIndex]?.objdata?.Remove?.some(
    item => item.Type === `RTID(${plant}@PlantTypes)`
  );
  
  return (
    <button 
      key={plant}
      onClick={() => removeFromWave(plant, selectedWave)} 
      className={`w-full block button text-center ${isInRemove ? 'red' : ''}`}
    >
      {plant}
    </button>
  );
})}
                                            </div>
                                        </div>
                                    : 'no wave selected'
                                }
                            </div>
                        </div>
                    </details>
            </div>

            {/* Conveyor code */}
            <div className="w-100 nodrag">
                <div className="flex">
                        <header className={`text-2xl  font-medium h-8 w-full transition-colors duration-300 ${isInvalidJson ? 'bg-red-500' : 'bg-cyan-300'}`}>
                            Conveyor code
                            <span className={`transition-opacity duration-300 ${isInvalidJson ? 'opacity-100' : 'opacity-0'}`}>
                                {' | invalid json'}
                            </span>
                        </header>
                    <button
                        className="button red rounded-none w-1/15"
                        title="reset conveyor"
                        onClick={() => resetConveyor()}>
                        <Refresh/>
                    </button>
                </div>
                <MonacoEditor
                    height="29rem"
                    defaultLanguage="json"
                    theme="vs-dark"
                    className='nokey'
                    value={JSON.stringify(conveyorArray,null,2)}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount} 
                    options={{
                    minimap: { enabled: false },
                    formatOnPaste: true,
                    fontSize: 12,
                    lineNumbers: 'on',
                    formatOnType: true,
                    automaticLayout: true,
                    scrollBeyondLastLine: false
                    }}
                />
            </div>
        </div>
    )
}

export default Conveyor;