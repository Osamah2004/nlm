import { useEffect, useState } from "react";
import PlantList from "../SeedBank/PlantList";
import { Editor } from "@monaco-editor/react";
import Checkbox from "../Inputs/CheckboxInput";

const parsedLocal = key => JSON.parse(localStorage.getItem(key)) || []

const Bin = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`size-${size}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);
const AllAlone = () =>{
    const [plantList,setPlantList] = useState([...PlantList]);
    
    const [search,setSearch] = useState('')
    const [selectedPlants,setSelectedPlants] = useState(parsedLocal('AllAlonePlants'));
    const [miniGameObjects,setMiniGameObjects] = useState(parsedLocal('allAloneObjects'))

    useEffect(() => {
        localStorage.setItem('allAloneObjects',JSON.stringify(miniGameObjects))
    },[miniGameObjects])

    useEffect(() => {
        localStorage.setItem('AllAlonePlants',JSON.stringify(selectedPlants))
    },[selectedPlants])

    useEffect(() => {
        search.trim().length === 0 ?
        setPlantList([...PlantList]) :
        setPlantList(PlantList.filter(f => f.includes(search)))
    },[search])

    const addToSelectedPlants = e => {
        let temp = [...miniGameObjects]
        const isAvailable = selectedPlants.includes(e);
        if (isAvailable) {
            setSelectedPlants(selectedPlants.filter(f => f !== e))
            temp = temp.filter(f => f.Type !== e)
        }
        else {
            setSelectedPlants([...selectedPlants, e])
            temp.push({
                Type:e,
                UpgradeDetails:{
                    DamageScale:1,
                    ShootIntervalScale:1
                }
            })
        }
        setMiniGameObjects(temp)
    }

    const upgradeDetail = (plant,key,value) => {
        let temp = [...miniGameObjects]
        let targetIndex = temp.findIndex(f => f.Type === plant)
        temp[targetIndex].UpgradeDetails[key] = Number(value)
        setMiniGameObjects(temp)
    }

    const fullPoints = (plant,value) => {
        let temp = [...miniGameObjects]
        let targetIndex = temp.findIndex(f => f.Type === plant)
        temp[targetIndex].FullPoint = Number(value)
        if (value === '0') delete temp[targetIndex].FullPoint
        setMiniGameObjects(temp)
    }

    const isInList = e => selectedPlants.includes(e)

    return (<div className="w-300 h-150 text-black">
        <header className="text-2xl bg-cyan-500 font-bold h-10 p-1">
            All Alone
        </header>
        <div className="flex">
            <div className="w-75 overflow-y-auto h-140">
                <header className="text-xl bg-cyan-400 font-medium sticky top-0">
                    Plants |
                    <label> Search:<input onChange={(e) => setSearch(e.target.value)} type="text" /></label>
                </header>
                <div className="space-y-1 v-button">
                    {[...parsedLocal('customPlants')].map(e => 
                        <button
                            onClick={() => addToSelectedPlants(e)}
                            className={`button ${isInList(e) ? 'red' : ''}`}>{e}</button>
                    )}
                    {plantList.map(e => 
                        <button
                            onClick={() => addToSelectedPlants(e)}
                            className={`button ${isInList(e) ? 'red' : ''}`}>{e}</button>
                    )}
                </div>
            </div>
            
            <div className="w-225 overflow-y-auto ">
                <Checkbox label="disable StandardIntro"/>
                <div className="flex w-225 mb-1">
                    <header className="text-xl w-full bg-cyan-400 font-medium sticky top-0">Selected Plants</header>
                    <button className="button rounded-none red" onClick={() => {
                        setSelectedPlants([]);
                        setMiniGameObjects([])
                    }}>
                        <Bin size={6}/>
                    </button>
                </div>
                <div className="space-y-1">
                    {selectedPlants.map(e => 
                        <div className="flex">
                            <div className="bg-cyan-200 w-225 hover:bg-cyan-300 transition-colors duration-300 p-1">
                                <p className="text-xl font-medium">{e}</p>
                                <div className="flex">
                                    <label className="w-60 text-lg flex">FullPoint:         <input onChange={(f) => fullPoints(e,f.target.value)} min={0} step={100} defaultValue={miniGameObjects.find(f => f.Type === e).FullPoint || 0} type="number" name="" /></label>
                                    <label className="w-70 text-lg flex">DamageScale:       <input onChange={(f) => upgradeDetail(e,'DamageScale',f.target.value)} min={0} step={0.25} defaultValue={miniGameObjects.find(f => f.Type === e).UpgradeDetails.DamageScale || 1} type="number" name="" /></label>
                                    <label className="w-80 text-lg flex">ShootIntervalScale:<input onChange={(f) => upgradeDetail(e,'ShootIntervalScale',f.target.value)} min={0} step={0.2} defaultValue={miniGameObjects.find(f => f.Type === e).UpgradeDetails.ShootIntervalScale || 1} type="number" name="" /></label>
                                </div>
                            </div>
                            <button onClick={() => addToSelectedPlants(e)} className="button red rounded-none px-1">
                                <Bin size={6}/>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            
        </div>

    </div>)}

export default AllAlone;