import NumberInput from "../Inputs/NumberInput";
import TextInput from "../Inputs/TextInput";
import { useEffect, useState } from "react";
import PlantList from "../SeedBank/PlantList";
import Checkbox from "../Inputs/CheckboxInput";
//  h-18 overflow-y-auto nowheel checked={JSON.parse(localStorage.getItem('potions')?.includes(e))} 
const Gray = ({msg}) => <p className="text-lg pl-1 w-full bg-gray-200 hover:bg-gray-400 transition mb-1">{msg}</p>
const CheckboxCurrent = ({ 
  label = "Checkbox", 
  checked = JSON.parse(localStorage.getItem('potions'))?.includes(label) || false,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (e) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    let temp = JSON.parse(localStorage.getItem('potions')) || []
    if (temp.includes(label)) {
      temp = temp.filter(f => f !== label)
    }
    else {
      temp.push(label)
    }
    console.log(temp)
    localStorage.setItem('potions',JSON.stringify(temp))
  };

  return (
    <label className="flex items-center justify-between cursor-pointer group p-1 hover:bg-cyan-50 rounded w-full">
    <span className="select-none">{label}:</span>

    <div className="relative">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="sr-only"
      />
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
}
/*
        "InitialSunDropDelay": 6,
        "SunCountdownBase": 7,
        "SunCountdownIncreasePerSun": 1,
        "SunCountdownMax": 17.5,
        "SunCountdownRange": 1,
        "Value": 125
*/
const Miscellaneous = () => {
    const [customPlants,setCustomPlants] =  useState(JSON.parse(localStorage.getItem('customPlants')) || [])
    const [filtered,setFiltered] = useState([...PlantList])
    const [search,setSearch] = useState("")

    useEffect(() => {
      console.log(customPlants)
      if (search.trim().length === 0) {
          setFiltered([...PlantList])
      }
      setFiltered([...PlantList].filter(f => f.includes(search)))
    },[search])

    return (
      <div className="w-170 h-125 overflow-y-auto nowheel">
        <div title="starting sun = 9900, first wave delay = 0, and adds one hit kill">
          <Checkbox label="debug mode"/>
        </div>
        <Checkbox label="25 sun meta"/>
        <details className="details">
          <summary className="summary">Mini games</summary>
          <div className="w-full grid grid-cols-2 gap-1 border-b pb-1">
            <button className="button">Cannons away</button>
            <button className="button">Air raid</button>
            <button className="button">Not ok Corral</button>
            <button className="button">Powder Keg</button>
            <button className="button">All alone</button>
            <button className="button">Bowling</button>
            <button className="button">beghouled</button>
            <button className="button">vasebraker</button>
          </div>
        </details>
        <details className="details">
          <summary className="summary">Custom zombosses</summary>
          <div className="w-full grid grid-cols-2 gap-1 border-b pb-1 h-26 overflow-y-auto">
            <button className="button">egypt</button>
            <button className="button">pirate</button>
            <button className="button">cowbow</button>
            <button className="button">future</button>
            <button className="button">dark</button>
            <button className="button">beach</button>
            <button className="button">iceage</button>
            <button className="button">lostcity</button>
            <button className="button">eighties</button>
            <button className="button">dino</button>
            <button className="button">modern</button>
          </div>
        </details>
        <details className="details">
          <summary className="summary">Custom sun dropper + Sun bomb</summary>
          <div className="w-full block border-b pb-1 h-40 overflow-y-auto">
              <NumberInput min={-1} label={"InitialSunDropDelay"}/>
              <NumberInput min={-1} label={"SunCountdownBase"}/>
              <NumberInput min={-1} label={"SunCountdownIncreasePerSun"}/>
              <NumberInput min={-1} label={"SunCountdownMax"}/>
              <NumberInput min={-1} label={"SunCountdownRange"}/>
              <NumberInput min={-1} label={"SunValue"}/>
              <Gray msg={"Sun bomb:"}/>
              <Checkbox label="enable sun bomb"/>
              {/* 
                      "PlantBombExplosionRadius": 
        "PlantDamage": 
        "ZombieBombExplosionRadius": 
        "ZombieDamage": 
         */}
              <NumberInput label={'PlantBombExplosionRadius'} default={25}/>
              <NumberInput label={'PlantDamage'} default={1000}/>
              <NumberInput label={'ZombieBombExplosionRadius'} default={80}/>
              <NumberInput label={'ZombieDamage'} default={500}/>
          </div>
        </details>
        <details className="details">
          <summary className="summary">Zombie potions</summary>
          <div className="w-full grid grid-cols-2 gap-1 border-b pb-1 h-26 overflow-y-auto">
              <NumberInput min={-1} default={2} label={"InitialPotionCount"}/>
              <NumberInput min={-1} default={5} label={"MaxPotionCount"}/>
              <NumberInput min={-1} default={3} label={"PotionSpawnTimerMax"}/>
              <NumberInput min={-1} default={1} label={"PotionSpawnTimerMin"}/>
          </div>
          <Gray msg={(<>Potions | <label className="ml-4">filter: <input onChange={(e) => setSearch(e.target.value)} type="text" /></label><button className=" ml-4 button" onClick={() => setCustomPlants(JSON.parse(localStorage.getItem('customPlants')))}>fetch custom plants</button></>)}/>
          <Checkbox label="enable potions"/>
          <div className="grid border-t grid-cols-3 h-50 overflow-y-auto overflow-x-hidden">
            <CheckboxCurrent label="zombiepotion_speed"/>
            <CheckboxCurrent label="zombiepotion_invisibility"/>
            <CheckboxCurrent label="zombiepotion_toughness"/>
            {customPlants.map(e => <CheckboxCurrent label={e}/>)}
            {filtered.map(e => <CheckboxCurrent label={e}/>)}
          </div>
        </details>
        <TextInput default={sessionStorage.getItem('Custom objective text') || null} label={"Custom objective text"} full={true}/>
        <div className="my-2"/>
        <Gray msg={"Zombies modifications:"}/>
        <Checkbox label="invisi goul"/>        
        <div title="scale = 0.7, speed = zombie's speed * 1.2">
          <Checkbox label="big trouble little zombies"/>
        </div>

        <div className="w-1/2">
          <NumberInput default={1} min={0.1} step={0.1}  label="zombie health multiplier"  />
          <p className='text-xs pl-1 -translate-y-2 text-gray-600'>Won't affect armor's health</p>
          <NumberInput default={1} min={0.1} step={0.1}  label="zombie speed multiplier"/>
          <NumberInput default={1} min={0.1} step={0.1}  label="zombie eatDPS multiplier"/>
        </div>
        <Gray msg={"Plants modifications:"}/>
        <div className="w-1/2">
          <NumberInput default={1} min={0.1} step={0.1}  label="plant health multiplier"  />
          <NumberInput default={1} min={0.1} step={0.1}  label="plant recharge multiplier"/>
        </div>
        <Checkbox label="2x sun cost"/>
      </div>
    );
}

export default Miscellaneous