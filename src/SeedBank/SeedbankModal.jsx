import { useState, useMemo, useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import { useHotkeys } from "react-hotkeys-hook"
import PlantList from "./PlantList"
import PlantTypes from '../assets/PlantTypes.json'
import PlantProps from '../assets/PlantProps.json'
import PlantAlmanac from '../assets/PlantAlmanac.json'
import ProjectileTypes from '../assets/ProjectileTypes.json'
import ProjectileProps from '../assets/ProjectileProps.json'

const getParsedLocal = (key) => JSON.parse(localStorage.getItem(key))

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

const plantFamilies = [...new Set(PlantProps.objects.map(e => e.objdata.Family))]

const getByFamiliy = (family) => PlantProps.objects.filter(f => f.objdata.Family === family).map(e => e.aliases[0])

const SeedbankModal = ({ listType }) => {
    let listName = ''
    switch (listType) {
        case 1: listName = 'preset';break;
        case 2: listName = 'include';break;
        case 3: listName = 'exclude';break;
        default: break;
    }
    const [selectedPlants,setSelectedPlants] = useState(getParsedLocal(`${listName}SelectedPlants`) || [])
    const [searchTerm,setSearchTerm] = useState("")
    const [plantFiltered,setFiltered] = useState([...PlantList])
    const customPlantsArray = getParsedLocal('customPlants') || []

    const addFamily = (family) => {
        if (family === '-') return
        let temp = getByFamiliy(family)
        setSelectedPlants([...selectedPlants,...temp.filter(f => !selectedPlants.includes(f))])
    }

    useEffect(() => {
        if (searchTerm.trim().length === 0) {
            setFiltered([...PlantList])
        }
        else setFiltered([...PlantList].filter(f => f.includes(searchTerm)))
    },[searchTerm])

    useEffect(() => {
        localStorage.setItem(`${listName}SelectedPlants`,JSON.stringify(selectedPlants))
    },[selectedPlants])

    const plantListClick = (e) => {
        let index = selectedPlants.findIndex(f => f === e)
        if (index === -1) setSelectedPlants([...selectedPlants,e]);
        else setSelectedPlants(selectedPlants.filter(f => f !== e))
    }
    
    return (
        <div className={`w-225 block text-black`}>
            <header className="w-full bg-cyan-500 pl-1 pb-2 text-4xl  font-bold">
                {listName} plants
            </header>
            <div className="flex w-full h-200">

                {/* Plant list */}
                <div className="w-1/2 border-r border-black">
                    <div className="sticky top-0">
                        <header className="bg-cyan-300 text-2xl  w-full font-medium h-8">Plant list</header>
                        <header className="bg-cyan-100 text-xl  w-full font-medium h-7 flex">
                            <label htmlFor="plantFilterInput" className="w-1/2 group">filter:<input onChange={(e) => setSearchTerm(e.target.value)} className="group-hover:bg-cyan-500" id="plantFilterInput" type="text" /></label>
                            {listType === 2 && <button onClick={() => setSelectedPlants([...customPlantsArray,...PlantList])} className="border rounded p-1 text-sm hover:bg-cyan-500 transition-colors duration-300 cursor-pointer">add all</button>}
                            {listType === 3 && (
                                <label htmlFor="addByFamily" className="w-1/2 text-sm pt-0.5">Add by family:
                                    <select
                                        onChange={(e) => addFamily(e.target.value)}
                                        name="addByFamily"
                                        id="addByFamily">
                                        <option hidden>select a family</option>
                                        <option value={'-'}>-</option>
                                        {plantFamilies.map((e,i) => 
                                            <option value={e} key={`family-${i}`}>{e}</option>
                                        )}
                                    </select>
                                </label>
                            )}
                        </header>
                    </div>
                    <div className="h-185 space-y-1 overflow-y-auto pt-1">
                        {customPlantsArray.length > 0 && 
                        <>
                            <details className="details space-y-1">
                                <summary className="summary">custom plants</summary>
                                {customPlantsArray.map(e => <button
                                                            className={`button block text-lg p-1 w-full ${selectedPlants.includes(e) ? 'red' : ''}`}
                                                            onClick={() => plantListClick(e)}
                                                            >{e}</button>)}
                            </details>
                            <hr />
                        </>
                        }
                        {plantFiltered.map(e => <button
                                                    className={`button block text-lg p-1 w-full ${selectedPlants.includes(e) ? 'red' : ''}`}
                                                    onClick={() => plantListClick(e)}
                                                    >{e}</button>)}
                    </div>
                </div>

                {/* Selected plants */}
                <div className="w-1/2 ">
                    <div className="sticky flex top-0">
                        <header className="bg-cyan-300 text-2xl  font-medium h-8 w-full">
                            Selected plants
                        </header>
                        <button onClick={() => setSelectedPlants([])} className="button rounded-none red">
                            <Bin/>
                        </button>
                    </div>
                    <div className="h-192 space-y-1 pt-1 overflow-y-auto">
                        {selectedPlants.map((e) => (
                            <div className="flex">
                                <button className="button py-1 left-capsule text-lg w-full">{e}</button>
                                <button onClick={() => setSelectedPlants(selectedPlants.filter(f => f !== e))} className="button py-1 w-7 rounded-none red"><Bin/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeedbankModal