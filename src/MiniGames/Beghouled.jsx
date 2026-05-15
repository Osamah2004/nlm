import { useEffect, useState } from "react";
import PlantList from "../SeedBank/PlantList";
import { Editor } from "@monaco-editor/react";
import NumberInput from "../Inputs/NumberInput";

const parsedLocal = key => JSON.parse(localStorage.getItem(key)) || [];
const stringifyToLocal = (key,value) => localStorage.setItem(key,JSON.stringify(value))

const Bin = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`size-${size || 6}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);


const Beghouled = () => {
    const zombiePool = JSON.parse(sessionStorage.getItem('zombiePool'))?.map(e => e.code) || []
    const [filtered,setFiltered] = useState([...PlantList]);
    const [selectedPlants,setSelectedPlants] = useState(parsedLocal('beghouledSelectedPlants'));
    const [initialPlants,setInitialPlants] = useState(parsedLocal('beghouledInitial'));
    const [upgradeMap,setUpgradeMap] = useState(parsedLocal('beghouledUpgradeMap'))
    const [matchesToWin,setMatchesToWin] = useState(100)
    const [stages,setStages] = useState(1)
    const [monacoArray,setMonacoArray] = useState([{
      "objclass": "BeghouledPresetProperties",
      "aliases": [
        "BeghouledProps"
      ],
      "objdata": {
        "MatchesToWin": matchesToWin,
        "InitialPlants": [],
        "UpgradeMap": []
      }
    },
    {
      "objclass": "BeghouledZombieSpawnerProperties",
      "aliases": [
        "BeghouledSpawner"
      ],
      "objdata": {
        "MatchCountsToStageAdvance": [
            {
                "MatchCount": 25,
                "StageNumber": 1
            }
        ],
        "Stages": [
            {
                "#comment": "Stage 0",
                "Types": [],
                "SpawnDelay": 2
            },
            {
                "#comment": "Stage 1",
                "Types": [],
                "SpawnDelay": 2
            }
        ]
      }
    }]);

    const search = e => e.trim() === '' ? setFiltered([...PlantList]) : setFiltered(filtered.filter(f => f.includes(e)));
    const isInList = (e,list) => list.includes(e);
    const addToList = (e,list,setter) => isInList(e,list) ? setter(list.filter(f => f !== e)) : setter([...list,e]);

    const handleStage = e => {
        let temp = [...monacoArray]
        if (e > stages) {
            temp[1].objdata['MatchCountsToStageAdvance'].push({MatchCount:e*25,StageNumber:e})
            temp[1].objdata['Stages'].push({Types:[],"#comment":`Stage ${e}`,SpawnDelay:2})
        }
        else {
            temp[1].objdata['MatchCountsToStageAdvance'].pop()
            temp[1].objdata['Stages'].pop()
        }
        setStages(e)
    }

    const handleSetMatches = e => {
        let temp = [...monacoArray]
        temp[0].objdata.MatchesToWin = Number(e)
        setMonacoArray(temp)
    }

    const modifyUpgradeMap = (index,plant,key) => {
        let temp = [...monacoArray]
        temp[0].objdata.UpgradeMap[index][key] = plant
        setMonacoArray(temp)
    }

    const upgradeMapSplice = index => {
        let temp = [...monacoArray]
        temp[0].objdata.UpgradeMap.splice(index,1)
        setMonacoArray(temp)
    }

    const handleMatchCount = (e,i) => {
        let temp = [...monacoArray]
        temp[1].objdata.MatchCountsToStageAdvance[i - 1].MatchCount = e
        setMonacoArray(temp)
    }

    const handleSpawnDelay = (e,i) => {
        let temp = [...monacoArray]
        temp[1].objdata.Stages[i].SpawnDelay = e
        setMonacoArray(temp)
    }

    const isInStage = (e, i) => {
        const types = monacoArray[1]?.objdata?.Stages[i]?.Types || [];
        return types.some(t => t.ZombieType === e);
    }

    const addZombieToStage = (e,i) => {
        let temp = [...monacoArray]
        if (isInStage(e,i)) {
            temp[1].objdata.Stages[i]['Types'] = temp[1].objdata.Stages[i]['Types'].filter(f => f.ZombieType !== e)
        }
        else temp[1].objdata.Stages[i]['Types'].push({ZombieType:e})
        setMonacoArray(temp)
    }

    useEffect(() => {
        stringifyToLocal('beghouledUpgradeMap',upgradeMap)
        let temp = [...monacoArray]
        temp[0].objdata.UpgradeMap = upgradeMap
        setMonacoArray(temp)
    },[upgradeMap])

    useEffect(() => {
        stringifyToLocal('beghouledInitial',initialPlants)
        let temp = [...monacoArray]
        temp[0].objdata.InitialPlants = (initialPlants)
        setMonacoArray(temp)
    },[initialPlants,upgradeMap])

    useEffect(() => {
        stringifyToLocal('beghouledSelectedPlants',selectedPlants)
    },[selectedPlants])

    useEffect(() => {
        stringifyToLocal('beghouled',monacoArray)
        if (initialPlants.length === 0) {
            localStorage.setItem('beghouled','[]')
        }
    },[monacoArray])

    return (
        <div className="w-350 h-200 text-black">
            <header className="header">
                Beghouled
            </header>
            <div className="flex">

                {/* left side: select plants */}
                <div className="block">
                    <header className="w-100 h-7 secondary">
                        <label>Search:<input onChange={(e) => search(e.target.value)} type="text" /></label>
                    </header>
                    <div className="v-button w-100 h-183">
                        {filtered.map(e => <button
                                onClick={() => addToList(e,selectedPlants,setSelectedPlants)}
                                className={`button ${isInList(e,selectedPlants) && 'red'}`}>{e}</button>)}
                    </div>
                </div>

                {/* middle side: selected plants */}
                <div className="block w-100 border-l">
                    {/* top: Initial plants */}
                    <div className="flex">
                        <header className="secondary w-full">
                            Initial plants
                        </header>
                        <button
                            onClick={() => {setSelectedPlants([]);setInitialPlants([])}}
                            className="button red rounded-none">
                            <Bin />
                        </button>
                    </div>
                    <div className="h-30 overflow-y-auto overflow-x-hidden">
                        <div className="grid grid-cols-3 gap-0.5">
                            {selectedPlants.map(e => <div className="flex">
                                <button
                                    onClick={() => addToList(e,initialPlants,setInitialPlants)}
                                    className={`button w-30 left-capsule ${isInList(e,initialPlants) ? '' : 'gray'}`}>{e}</button>
                                <button
                                    onClick={() => addToList(e,selectedPlants,setSelectedPlants)}
                                    className="button w-5 right-capsule red">
                                    <Bin size={5}/>
                                </button>
                            </div>)}
                        </div>
                    </div>

                    {/* middle: Upgrade map */}
                    <header className="secondary">Upgrade map</header>
                    <div className="h-65 overflow-y-auto">
                        <button
                            onClick={() => setUpgradeMap([...upgradeMap,{BasePlant:'',UpgradedPlant:''}])}
                            className="button sticky top-0 z-10 gray w-full p-2 text-center rounded-none">
                            Add upgrade map
                        </button>
                        {upgradeMap.map((element,index) => {
                            return (
                                <div className="flex p-2 pr-0 bg-cyan-200 my-0.5">
                                    <div className="w-4/8">
                                        <label htmlFor="">
                                            Base plant:
                                            <select
                                                value={element.BasePlant || '-'}
                                                onChange={(e) => modifyUpgradeMap(index,e.target.value,'BasePlant')}
                                                className="select w-20">
                                                <option value="-" hidden>-</option>
                                                {initialPlants.map(e => <option value={e} key={e}>{e}</option>)}
                                            </select>
                                        </label>
                                    </div>
                                    <div className="w-4/7">
                                        <label htmlFor="">
                                            Upgrade plant:
                                            <select
                                                value={element.UpgradedPlant || '-'}
                                                onChange={(e) => modifyUpgradeMap(index,e.target.value,'UpgradedPlant')}
                                                className="select w-20">
                                                <option value="-" hidden>-</option>
                                                {selectedPlants.map(e => <option value={e} key={e}>{e}</option>)}
                                            </select>
                                        </label>
                                    </div>
                                    <button onClick={() => upgradeMapSplice(index)} className="button red">
                                        <Bin />
                                    </button>
                                </div>
                            );})}
                    </div>
                    
                    {/* bottom: Stages */}
                    <div className="h-81 overflow-y-auto overflow-x-hidden">

                        <header className="secondary sticky top-0">Stages</header>
                        <label 
                            className="group w-95 flex"
                            htmlFor="beghouled-matches">
                            matches:
                            <input
                                id="beghouled-matches"
                                defaultValue={100}
                                step={25}
                                min={25}
                                onChange={(e) => handleSetMatches(e.target.value)}
                                className="w-20"
                                type="number"
                                name=""/>
                        </label>
                        <label 
                            className="group w-95 flex"
                            htmlFor="beghouled-stages">
                            stages:
                            <input
                                defaultValue={1}
                                step={1}
                                min={1}
                                onChange={(e) => handleStage(Number(e.target.value))}
                                id="beghouled-stages"
                                className="w-20"
                                type="number"
                                name=""/>
                        </label>

                        {Array.from({length:stages+1}).map((_,i) => {
                            return (
                                <details className="details space-y-1">
                                    <summary className="summary">Stage {i}</summary>
                                        {i !== 0 && 
                                            <label htmlFor={`beghouled-stage-${i}`} className="group flex">
                                                MatchCount:<input defaultValue={25} min={25} step={25} onChange={(e) => handleMatchCount(Number(e.target.value),i)} id={`beghouled-stage-${i}`} type="number" name="" />
                                            </label>
                                        }
                                        <label htmlFor={`beghouled-stage-${i}`} className="group flex">
                                            SpawnDelay:<input defaultValue={2} min={1} onChange={(e) => handleSpawnDelay(Number(e.target.value),i)} id={`beghouled-stage-${i}`} type="number" name="" />
                                        </label>
                                        <p className="bg-gray-400 text-white text-center">
                                            zombie pool
                                        </p>
                                        <div className="grid grid-cols-3 gap-1">
                                        {zombiePool.map(e => 
                                        <button
                                            onClick={() => addZombieToStage(e,i)}
                                            className={`button ${isInStage(e,i) ? 'red' : 'gray'}`}>
                                        {e}</button>)}
                                        </div>
                                </details>
                            );})}
                    </div>
                </div>

                {/* beghouled code */}
                <div className="w-150">
                    <Editor
                        height={'99.9%'}
                        language="json"
                        theme="vs-dark"
                        value={JSON.stringify(monacoArray,null,4)}
                        options={{
                            readOnly:true
                        }}
                        />
                </div>
            </div>
        </div>
    )
}

export default Beghouled;