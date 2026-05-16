import { useState,useEffect } from "react";
import NumberInput from "../Inputs/NumberInput";

const Escalation = () => {
    const [a,setA] = useState(JSON.parse(localStorage.getItem('A pool')) || []);
    const [b,setB] = useState(JSON.parse(localStorage.getItem('B pool')) || []);
    const [c,setC] = useState(JSON.parse(localStorage.getItem('C pool')) || []);
    const [d,setD] = useState(JSON.parse(localStorage.getItem('D pool')) || []);

    const [zombiePool,setPool] = useState([])

    const isInList = (list,key) => list.includes(key)
    const addToList = (list,key,setter) => isInList(list,key) ?
        setter(list.filter(f => f !== key)) :
        setter([...list,key]);

    useEffect(() => {
        // Function to update boardItem from localStorage
        const updatePool = () => {
            setPool(JSON.parse(sessionStorage.getItem('zombiePool'))?.map(e => e.code) || []);
        };
        
        // Listen for storage events (works across tabs/windows)
        window.addEventListener('storage', (e) => {
            if (e.key === 'zombiePool') {
                updatePool();
            }
        });
        
        // Polling fallback for same-tab changes (if needed)
        const interval = setInterval(updatePool, 100);
        
        // Initial load
        updatePool();
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', updatePool);
        };
    }, []);

    useEffect(() => {localStorage.setItem('A pool',JSON.stringify(a))},[a])
    useEffect(() => {localStorage.setItem('B pool',JSON.stringify(b))},[b])
    useEffect(() => {localStorage.setItem('C pool',JSON.stringify(c))},[c])
    useEffect(() => {localStorage.setItem('D pool',JSON.stringify(d))},[d])

    return (
        <div className="w-165 h-200 text-black space-y-4 overflow-y-auto overflow-x-hidden">

            <div className="w-full h-45 overflow-y-auto overflow-x-hidden bg-cyan-50">
                <div className="flex">
                    <div className="block">
                        <header className="secondary">Difficulty D (easy)</header>
                        <div className="w-fit">
                            <NumberInput label={'(D) PointIncrementPerWave'}/>
                            <NumberInput label={'(D) StartingPoints'}/>
                            <NumberInput label={'(D) StartingWave'}/>
                        </div>
                    </div>
                    <div className="block border-l w-82">
                        <header className="secondary">Zombie pool</header>
                        <div className="grid grid-cols-2 gap-1">
                            {zombiePool.map(e => <button onClick={() => addToList(d,e,setD)} className={`button ${isInList(d,e) ? 'red' : 'gray'}`}>{e}</button>)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="w-full h-45 overflow-y-auto overflow-x-hidden bg-cyan-50">
                <div className="flex">
                    <div className="block">
                        <header className="secondary">Difficulty C (meduim)</header>
                        <div className="w-fit">
                            <NumberInput label={'(C) PointIncrementPerWave'}/>
                            <NumberInput label={'(C) StartingPoints'}/>
                            <NumberInput label={'(C) StartingWave'}/>
                        </div>
                    </div>
                    <div className="block border-l w-82">
                        <header className="secondary">Zombie pool</header>
                        <div className="grid grid-cols-2 gap-1">
                            {zombiePool.map(e => <button onClick={() => addToList(c,e,setC)} className={`button ${isInList(c,e) ? 'red' : 'gray'}`}>{e}</button>)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-45 overflow-y-auto overflow-x-hidden bg-cyan-50">
                <div className="flex">
                    <div className="block">
                        <header className="secondary">Difficulty B (hard)</header>
                        <div className="w-fit">
                            <NumberInput label={'(B) PointIncrementPerWave'}/>
                            <NumberInput label={'(B) StartingPoints'}/>
                            <NumberInput label={'(B) StartingWave'}/>
                        </div>
                    </div>
                    <div className="block border-l w-82">
                        <header className="secondary">Zombie pool</header>
                        <div className="grid grid-cols-2 gap-1">
                            {zombiePool.map(e => <button onClick={() => addToList(b,e,setB)} className={`button ${isInList(b,e) ? 'red' : 'gray'}`}>{e}</button>)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-45 overflow-y-auto overflow-x-hidden bg-cyan-50">
                <div className="flex">
                    <div className="block">
                        <header className="secondary">Difficulty A (hardest)</header>
                        <div className="w-fit">
                            <NumberInput label={'(A) PointIncrementPerWave'}/>
                            <NumberInput label={'(A) StartingPoints'}/>
                            <NumberInput label={'(A) StartingWave'}/>
                        </div>
                    </div>
                    <div className="block border-l w-82">
                        <header className="secondary">Zombie pool</header>
                        <div className="grid grid-cols-2 gap-1">
                            {zombiePool.map(e => <button onClick={() => addToList(a,e,setA)} className={`button ${isInList(a,e) ? 'red' : 'gray'}`}>{e}</button>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Escalation;