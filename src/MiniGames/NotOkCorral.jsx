import { useEffect, useState } from "react";
import PlantList from "../SeedBank/PlantList";

const fromSession = key => JSON.parse(sessionStorage.getItem(key))
const toSession = (key,value) => sessionStorage.setItem(key,JSON.stringify(value))

const NotOkCorral = () => {
    const [filtered, setFiltered] = useState([...PlantList])
    const [search, setSearch] = useState('')
    const wave = Number(sessionStorage.getItem('Wave Count')) || 10
    const interval = Number(sessionStorage.getItem('Flag Interval')) || 5
    
    // Initialize from sessionStorage properly
    const [plantOrder, setPlantOrder] = useState(() => {
        const saved = fromSession('NOC_order')
        if (saved && saved.length === wave) {
            return saved
        }
        // If saved exists but length differs, adjust it
        if (saved && saved.length !== wave) {
            const adjusted = Array.from({ length: wave })
            saved.forEach((plant, idx) => {
                if (idx < wave) adjusted[idx] = plant
            })
            return adjusted
        }
        return Array.from({ length: wave })
    })
    
    const [plantPool, setPlantPool] = useState(() => fromSession('NOC_pool') || [])

    useEffect(() => {
        setFiltered(PlantList.filter(f => f.toLowerCase().includes(search.toLowerCase())))
    }, [search])

    const plantToOrder = (plant, index) => {
        let temp = [...plantOrder]
        temp[index] = plant === '-' ? undefined : plant
        setPlantOrder(temp)
        toSession('NOC_order', temp)
    }
    
    const plantToPool = plant => {
        if (plantPool.includes(plant)) {
            setPlantPool(plantPool.filter(f => f !== plant))
        } else {
            setPlantPool([...plantPool, plant])
        }
    }

    const clear = () => {
        setPlantOrder(Array.from({ length: wave }))
        setPlantPool([])
        toSession('NOC_order', Array.from({ length: wave }))
        toSession('NOC_pool', [])
    }
    
    useEffect(() => {
        toSession('NOC_pool', plantPool)
        localStorage.setItem('conveyor-pool', JSON.stringify(plantPool))
    }, [plantPool])

    useEffect(() => {
        toSession('NOC_order', plantOrder)
        let conveyor = [
            {
                aliases: ["Conveyor"],
                objclass: "ConveyorSeedBankProperties",
                objdata: {
                    InitialPlantList: [
                        {
                            PlantType: plantOrder[0],
                        },
                    ],
                    ManualPacketSpawning: true,
                    SpeedConditions: [
                        {
                            MaxPackets: 0,
                            Speed: 100,
                        },
                    ],
                    },
            },
        ];
        plantOrder.forEach((e,i) => {
            if (i === 0) return;
            if (e === plantOrder[i-1]) return;
            if (e === '-') return;
            let temp = {
                aliases:[`conveyor-${i+1}`],
                objclass:'ModifyConveyorWaveActionProps',
                objdata: {
                    Add:[{MaxWeightFactor:10,MinWeightFactor:0.1,Type:`RTID(${e}@PlantTypes)`}],
                    Remove:[{Type:`RTID(${plantOrder[i-1]}@PlantTypes)`}]
                }
            }
            conveyor.push(temp)
        })
        localStorage.setItem('conveyor',JSON.stringify(conveyor))
        sessionStorage.setItem('is_noc',plantOrder.some(e => e !== undefined))
    }, [plantOrder])

    return (
        <>
            <header className="header">Not Ok Corral</header>
            <div className="h-150 w-200 text-black flex">
                <div className="v-button w-1/2">
                    <header className="secondary sticky top-0">
                        Plants |
                        <label>Search: <input onChange={(e) => setSearch(e.target.value)} type="text" /></label>
                    </header>
                    {filtered.map((e, idx) => (
                        <button 
                            key={`plant-${idx}`}
                            onClick={() => plantToPool(e)} 
                            className={`button ${plantPool.includes(e) ? 'red' : ''}`}
                        >
                            {e}
                        </button>
                    ))}
                </div>

                <div className="v-button w-1/2">
                    <header className="secondary">Plant pool</header>
                    <div className="h-25">
                        <div className="grid grid-cols-3 gap-1 max-h-full overflow-auto">
                            {plantPool.map((plant, idx) => (
                                <button 
                                    key={`pool-${idx}`}
                                    className="button gray disabled"
                                >
                                    {plant}
                                </button>
                            ))}
                        </div>
                    </div>
                    <header className="secondary">Waves</header>
                    <div className="overflow-auto">
                        {plantOrder.map((plant, orderIndex) => (
                            <div key={`wave-${orderIndex}`}>
                                <div className="flex">
                                    <p className={`block p-1 text-lg font-medium w-25 border-r-2 ${(orderIndex + 1) % interval === 0 ? 'bg-red-400' : ''}`}>
                                        Wave: {orderIndex + 1}
                                    </p>
                                    <label className="text-lg" htmlFor={`wave-${orderIndex}`}>
                                        Plant:
                                        <select
                                            id={`wave-${orderIndex}`}
                                            onChange={(e) => plantToOrder(e.target.value, orderIndex)}
                                            className="select w-50 text-lg"
                                            value={plant || '-'}
                                        >
                                            <option value="-">-</option>
                                            {plantPool.map((poolPlant, poolIndex) => (
                                                <option key={`not-ok-corral-plant-${orderIndex}-${poolIndex}`} value={poolPlant}>
                                                    {poolPlant}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <footer className="bg-cyan-950 p-2">
                <button onClick={clear} className="button red px-2 text-lg">clear</button>
            </footer>
        </>
    )
}

export default NotOkCorral;