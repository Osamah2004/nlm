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
    
const WrenchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
)

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
)

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
)

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

const CustomPlantModal = () => {
    const [selectedPlants,setSelectedPlants] = useState(getParsedLocal(`CustomSelectedPlantsForModal`) || [])
    const [searchTerm,setSearchTerm] = useState("")
    const [plantFiltered,setFiltered] = useState([...PlantList])
    const [selectedCustomPlant,setSelectedCustomPlant] = useState(null)
    const [customPlantIdTracker,setCustomPlantIdTracker] = useState(Number(localStorage.getItem('customPlantId')) || 1)
    const [selectedCustomPlantId,setSelectedCustomPlantId] = useState(0)
    const [isInvalidJson,setIsInvalidJson] = useState(false)
    const projectileKeys = [
        "PeaType", "ExplodeProjectileType", "SeedlingType", "PlantfoodCallingType",
        "GrowUpType", "SummonType", "CabbageType", "CabbageType0", "CabbageType1",
        "CabbageType2", "BoomerangType", "SporeType", "PlantfoodGumProjectileType",
        "PeaFreezeType", "ButterType", "LiquidType", "MintLiquidType", "MeteorType",
        "SawType", "BananaType", "BambooshotType", "HollyProjectileType", "ProjectileType",
        "HypnotizingProjectileType", "GrapeType", "TileType", "AttackProjectileType"
    ]
    const [headerText,setHeaderText] = useState(null)

    useEffect(() => {
        localStorage.setItem('customPlantId',customPlantIdTracker)
    },[customPlantIdTracker])
    useEffect(() => {
        if (searchTerm.trim().length === 0) {
            setFiltered([...PlantList])
        }
        else setFiltered([...PlantList].filter(f => f.includes(searchTerm)))
    },[searchTerm])

    useEffect(() => {
        localStorage.setItem('customPlantsIds',JSON.stringify(selectedPlants.map(e => e.customId)))
        localStorage.setItem('customPlants',JSON.stringify(selectedPlants.map(e => e.customName)))
        localStorage.setItem(`CustomSelectedPlantsForModal`,JSON.stringify(selectedPlants))
    },[selectedPlants])

    const plantListClick = (e) => {
        // debugger;
        let customPlantName = `${e}-$${customPlantIdTracker}`
        setSelectedPlants([...selectedPlants,{isCustom:true,base:e,customName:customPlantName,customId:customPlantIdTracker}])
        
        let plantType = structuredClone(PlantTypes.objects.find(f => f.aliases[0] === e))
        let plantProps = structuredClone(PlantProps.objects.find(f => f.aliases[0] === e))
        plantType.aliases[0] = customPlantName
        let plantObjects = [
            plantType,
            {
                "objclass": "PlantAlmanacProperties",
                "aliases": [
                    customPlantName
                    ],
                "objdata": {
                    "BriefIntroduction": {
                        "en": PlantAlmanac.objects.find(f => f.aliases[0] === e).objdata.BriefIntroduction.en,
                        "zh": "..."
                    }
                }
            },
            plantProps,
            ]

        let propsObjects = Object.keys(plantProps.objdata)
        const commonKeys = getIntersection(propsObjects,projectileKeys)
        if (commonKeys) {
            commonKeys.forEach(f => {
                const projectileValue = plantProps.objdata[f]
                const projectileType = ProjectileTypes.objects.find(g => g.aliases[0] === projectileValue)
                const projectileProps = ProjectileProps.objects.find(g => g.aliases[0] === projectileValue)
                plantObjects.push(projectileType)
                plantObjects.push(projectileProps)
            })
        }
        localStorage.setItem(`customPlant-${customPlantIdTracker}`,JSON.stringify(plantObjects))
        setCustomPlantIdTracker(customPlantIdTracker + 1)
    }

    const getIntersection = (A, B) => {
        const setB = new Set(B);
        const result = [...new Set(A)].filter(x => setB.has(x));
        return result.length ? result : false;
    };

    const isValidJson = (str) => {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    const handleWrenchButton = (e) => {
        setHeaderText(e.customName)
        setSelectedCustomPlant(getParsedLocal(`customPlant-${e.customId}`))
        setSelectedCustomPlantId(e.customId)
        setIsInvalidJson(false)
    }

    const clearSelectedPlants = () => {
        selectedPlants.forEach(e => localStorage.removeItem(`customPlant-${e.customId}`))
        setSelectedPlants([])
        setCustomPlantIdTracker(1)
        setSelectedCustomPlant(null)
        setSelectedCustomPlantId(0)
    }

    const refreshCustomNames = () => {
        let temp = [...selectedPlants]
        let targetPlant = temp.findIndex(f => f.customId === selectedCustomPlantId)
        temp[targetPlant].customName = getParsedLocal(`customPlant-${selectedCustomPlantId}`)[0].aliases[0]
        setSelectedPlants(temp)
    }

    const handleEditorChange = (value) => {
        if (isValidJson(value)) {
            localStorage.setItem(`customPlant-${selectedCustomPlantId}`,value)
            refreshCustomNames()
            setHeaderText(JSON.parse(value)[0].aliases[0])
            setIsInvalidJson(false)
        }
        else setIsInvalidJson(true)
    }

    const removeCustomPlant = (e) => {
        let temp = [...selectedPlants]
        let target = temp.findIndex(f => f.customName === e)
        localStorage.removeItem(`customPlant-${temp[target].customId}`)
        temp.splice(target,1)
        setSelectedPlants(temp)
        setSelectedCustomPlant(null)
        setSelectedCustomPlantId(0)
    }
    
    return (
        <div className={`w-350 block text-black`}>
            <header className="w-full bg-cyan-500 pl-1 pb-2 text-4xl  font-bold">
                Custom plants
            </header>
            <div className="flex w-full h-200">

                {/* Plant list */}
                <div className="w-100 border-r border-black">
                    <div className="sticky top-0">
                        <header className="bg-cyan-300 text-2xl  w-full font-medium h-8">Plant list</header>
                        <header className="bg-cyan-100 text-xl  w-full font-medium h-7 flex">
                            <label htmlFor="plantFilterInput" className="w-1/2 group">search:<input onChange={(e) => setSearchTerm(e.target.value)} className="group-hover:bg-cyan-500" id="plantFilterInput" type="text" /></label>
                        </header>
                    </div>
                    <div className="h-185 space-y-1 overflow-y-auto">
                    {plantFiltered.map(e => <button
                                                className={`button block text-lg p-1 w-full ${selectedPlants.map(f => f.plantName).includes(e) ? 'red' : ''}`}
                                                onClick={() => plantListClick(e)}
                                                >{e}</button>)}
                    </div>
                </div>

                {/* Selected plants */}
                <div className="w-100 ">
                    <div className="sticky flex top-0">
                        <header className="bg-cyan-300 text-2xl  font-medium h-8 w-95">
                            Selected plants
                        </header>
                        <button onClick={() => clearSelectedPlants()} className="button rounded-none red">
                            <Bin/>
                        </button>
                    </div>
                    <div className="h-192 space-y-1 pt-1 overflow-y-auto">
                        {selectedPlants.map((e) => (
                            <div className="flex">
                                <button className="button py-1 left-capsule text-lg w-88">{e.customName}</button>
                                <button onClick={() => handleWrenchButton(e)}  className="button py-1 w-7 text-center rounded-none gray"><WrenchIcon/></button>
                                <button onClick={() => removeCustomPlant(e.customName)} className="button py-1 w-7 rounded-none red"><Bin/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom plant */}
                <div className="w-150 border-l border-black">
                        <header className={`text-2xl  font-medium h-8 w-full transition-colors duration-300 ${isInvalidJson ? 'bg-red-500' : 'bg-cyan-300'}`}>
                            {headerText || "Custom plant"} 
                            <span className={`transition-opacity duration-300 ${isInvalidJson ? 'opacity-100' : 'opacity-0'}`}>
                                {' | invalid json'}
                            </span>
                        </header>
                        <Editor                        
                                height="48rem"
                                defaultLanguage="json"
                                theme="vs-dark"
                                className='nokey'
                                value={JSON.stringify(selectedCustomPlant, null, 2)}
                                onChange={handleEditorChange}
                                options={{
                                minimap: { enabled: true },
                                formatOnPaste: true,
                                fontSize: 14,
                                quickSuggestions: false,
                                lineNumbers: 'on',
                                formatOnType: true,
                                automaticLayout: true,
                                scrollBeyondLastLine: false
                                }}
                            />
                </div>
            </div>
        </div>
    )
}

export default CustomPlantModal