import { useState,useMemo } from 'react'
import Editor from '@monaco-editor/react';


import types from '../assets/ZombieTypes.json'
import props from '../assets/ZombieProps.json'
import NumberInput from '../Inputs/NumberInput'

const getZombossObjects = (e) => [
    structuredClone(types.objects.find(f => f.aliases[0] === `zombossmech_${e}`)),
    structuredClone(props.objects.find(f => f.aliases[0] === `zombossmech_${e}`))
]
// Move this outside the component function entirely
const getUniqueZombieList = (zombossTypeName) => {
  const [_, zombossProps] = getZombossObjects(zombossTypeName);
  const zombieListAcrossStages = zombossProps.objdata.ZombossStages.flatMap(stage =>
    stage.Actions.flatMap(action => 
      action.summonProps?.zombieList || []
    )
  );
  return [...new Set(zombieListAcrossStages)];
};
const ZombossModal = ({ZombossTypeName}) => {
    const [stagesNum,setStagesNum] = useState(ZombossTypeName === 'eighties' ? 5 : 3)
    const [zombossCode,setZombossCode] = useState(getZombossObjects(ZombossTypeName))
    const originalStages = getZombossObjects(ZombossTypeName)[1].objdata.ZombossStages
    const [currentStages,setCurrentStages] = useState([...originalStages])
    
    const uniqueZombieList = getUniqueZombieList(ZombossTypeName);
    const zombiePool = JSON.parse(sessionStorage.getItem('zombiePool')).map(e => e.code) || false

    const decrement = () => {
        if (stagesNum === 1) return
        let temp = [...zombossCode]
        temp[1].objdata.ZombossStages.pop()
        setCurrentStages(temp[1].objdata.ZombossStages)
        setZombossCode(temp)
        setStagesNum(stagesNum - 1)
    };
    const increment = () => {
        let temp = [...zombossCode]
        let lastStageCopy = structuredClone(currentStages.at(-1))
        if (stagesNum < originalStages.length) temp[1].objdata.ZombossStages.push(originalStages[stagesNum]);
        else temp[1].objdata.ZombossStages.push(lastStageCopy)
        setCurrentStages(temp[1].objdata.ZombossStages)
        setStagesNum(stagesNum + 1)
    };

    const modifyStage = (index,key,value) => {
        let temp = [...zombossCode]
        temp[1].objdata.ZombossStages[index][key] = Number(value)
        setZombossCode(temp)
    }

    const handleActionChange = (stageIndex,actionIndex,actionName,value) => {
        let temp= [...zombossCode]
        temp[1].objdata.ZombossStages[stageIndex]['Actions'][actionIndex][actionName] = Number(value)
        setZombossCode(temp)
    }

    const isInList = (stageIndex,zombie) => zombossCode[1].objdata.ZombossStages[stageIndex].Actions.find(f => f.actionName === 'summon').summonProps.zombieList.includes(zombie);

    const handleZombieSpawn = (stageIndex,zombie) => {
        let temp = [...zombossCode]
        if (isInList(stageIndex,zombie)){
            temp[1].objdata.ZombossStages[stageIndex].Actions.find(f => f.actionName === 'summon').summonProps.zombieList =
            temp[1].objdata.ZombossStages[stageIndex].Actions.find(f => f.actionName === 'summon').summonProps.zombieList.filter(f => f !== zombie);
        }
        else temp[1].objdata.ZombossStages[stageIndex].Actions.find(f => f.actionName === 'summon').summonProps.zombieList.push(zombie)
        setZombossCode(temp)
    }

    const summonPointChange = (stageIndex,key,value) => {
        let temp = [...zombossCode]
        temp[1].objdata.ZombossStages[stageIndex].Actions.find(f => f.actionName === 'summon').summonProps[key] = Number(value);
        setZombossCode(temp)
    }

    console.log(currentStages)

    return (
      <div className="w-400 h-240 text-black flex">
        <div className="w-5/12 space-y-1 text-xl h-full overflow-y-auto">
            <header className="header">zombossmech_{ZombossTypeName}</header>
            <div className="flex ">
                <p>number of stages: {stagesNum}</p>
                <button className="button py-1 px-1.5 mx-2" onClick={() => decrement()} >
                -
                </button>
                <button className="button py-1 px-1.5" onClick={() => increment()}>
                +
                </button>
            </div>
            {currentStages.map((stage,index) => (
                <>
                    <details className="details space-y-1">
                        <summary className="summary">Stage {index + 1}</summary>
                        {Object.keys(stage).map((key) => {
                        return key !== 'Actions' ? (
                            <>
                                <label htmlFor={`stage-${index + 1}-${key}`} className="flex justify-between items-center hover:bg-cyan-500 transition-colors duration-300">
                                    {key}
                                    <input 
                                        onChange={(e) => modifyStage(index,key,e.target.value)} 
                                        defaultValue={stage[key]} 
                                        id={`stage-${index + 1}-${key}`} 
                                        type="number" 
                                    />
                                </label>
                            </>
                        ) : (
                            <>
                            <p className='text-lg font-bold'>Actions:</p>
                            <div className="grid grid-cols-2">
                                {stage[key].map((action,i) => (
                                    <div>
                                        <header className={`bg-cyan-400 font-bold ${i % 2 === 0 ? 'border-r' : ''}`}>
                                            {action.actionName}
                                        </header>
                                        <label htmlFor={`stage-${index + 1}-${action.actionName}-weight`}       className='transition-colors duration-300 hover:bg-cyan-500 flex justify-between items-center w-full'>
                                            weight:<input defaultValue={stage[key][i].weight} onChange={(e) => handleActionChange(index,i,'weight',e.target.value)} className='ml-auto' type="number" id={`stage-${index + 1}-${action.actionName}-weight`} />
                                        </label>
                                        <label htmlFor={`stage-${index + 1}-${action.actionName}-repeatMax`}    className='transition-colors duration-300 hover:bg-cyan-500 flex justify-between items-center w-full'>
                                            repeatMax:<input defaultValue={stage[key][i].repeatMax} onChange={(e) => handleActionChange(index,i,'repeatMax',e.target.value)} className='ml-auto' type="number" id={`stage-${index + 1}-${action.actionName}-repeatMax`} />
                                        </label>
                                        <label htmlFor={`stage-${index + 1}-${action.actionName}-repeatMin`}    className='transition-colors duration-300 hover:bg-cyan-500 flex justify-between items-center w-full'>
                                            repeatMin:<input defaultValue={stage[key][i].repeatMin} onChange={(e) => handleActionChange(index,i,'repeatMin',e.target.value)} className='ml-auto' type="number" id={`stage-${index + 1}-${action.actionName}-repeatMin`} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                            </>
                        )
                        })}
                        <hr />
                        <header className={`bg-cyan-400 font-bold`}>
                            Stage {index + 1} summon list
                        </header>
                        <label htmlFor={`stage-${index + 1}-pointMin`} className='block hover:bg-cyan-500 transition-colors duration-300 relative'>
                            pointMin:<input onChange={(e) => summonPointChange(index,'pointMin',e.target.value)} type='number' step={100} id={`stage-${index + 1}-pointMin`} className='absolute right-0' defaultValue={stage.Actions.find(f => f.actionName === 'summon').summonProps.pointMin} />
                        </label>
                        <label htmlFor={`stage-${index + 1}-pointMax`} className='block hover:bg-cyan-500 transition-colors duration-300 relative'>
                            pointMax:<input onChange={(e) => summonPointChange(index,'pointMax',e.target.value)} type='number' step={100} id={`stage-${index + 1}-pointMax`} className='absolute right-0' defaultValue={stage.Actions.find(f => f.actionName === 'summon').summonProps.pointMax} />
                        </label>
                        <p className='text-lg font-bold'>Your zombie pool: </p>
                        {zombiePool.length === 0 && 'empty'}
                        <div className="grid grid-cols-3 gap-1 max-h-30 overflow-y-auto">
                            {zombiePool.map(e => (
                                <button onClick={() => handleZombieSpawn(index,e)} className={`button p-1 text-lg ${isInList(index,e) ? 'red' : 'gray'} transition-colors duration-300`}>{e}</button>
                            ))}
                        </div>
                        <p className='text-lg font-bold'>zombossmech_{ZombossTypeName} pool:</p>
                        <div className="grid grid-cols-3 gap-1 max-h-30 overflow-y-auto">
                            {uniqueZombieList.map(e => (
                                <button onClick={() => handleZombieSpawn(index,e)} className={`button p-1 text-lg ${isInList(index,e) ? 'red' : 'gray'} transition-colors duration-300`}>{e}</button>
                            ))}
                        </div>
                    </details>
                </>
          ))}
          {/* <details className="details">
            <summary className="summary">Stage 1</summary>
            <label className="block relative">
              AnimRateModifier
              <input className="absolute right-0" type="number" />
            </label>
            <label className="block relative">
              ChilledDurationFromFrozen
              <input className="absolute right-0" type="number" />
            </label>
            <label className="block relative">
              DamageIndexFull
              <input className="absolute right-0" type="number" />
            </label>
            <label className="block relative">
              DamageIndexHalf
              <input className="absolute right-0" type="number" />
            </label>
            <label className="block relative">
              HitPoints
              <input className="absolute right-0" type="number" />
            </label>
            <label className="block relative">
              MaxIdleTime
              <input className="absolute right-0" type="number" />
            </label>
            <label className="block relative">
              MinIdleTime
              <input className="absolute right-0" type="number" />
            </label>
            <label className="block relative">
              StunDamageScale
              <input className="absolute right-0" type="number" />
            </label>
            <label className="block relative">
              StunStaggerBackMovement
              <input className="absolute right-0" type="number" />
            </label>
            <label className="block relative">
              StunStaggerBackTime
              <input className="absolute right-0" type="number" />
            </label>
            <label className="block relative">
              StunTime
              <input className="absolute right-0" type="number" />
            </label>
            <p className='text-lg font-bold'>Actions:</p>
            <details className="details">
              <summary className="summary">rush</summary>
            </details>
            <details className="details">
              <summary className="summary">walk</summary>
            </details>
            <details className="details">
              <summary className="summary">shoot</summary>
            </details>
            <details className="details">
              <summary className="summary">summon</summary>
              <label className="block relative">
                weight
                <input className="absolute right-0" type="number" />
              </label>
              <label className="block relative">
                repeatMax
                <input className="absolute right-0" type="number" />
              </label>
              <label className="block relative">
                repeatMin
                <input className="absolute right-0" type="number" />
              </label>
              summonProps:
              <label className="block relative">
                pointMin:
                <input className="absolute right-0" type="number" />
              </label>
              <label className="block relative">
                pointMax:
                <input className="absolute right-0" type="number" />
              </label>
                <p className='text-lg font-bold py-1'>zombieList:</p>
              <div className="grid grid-cols-2 gap-1">
                <button className="button red text-lg">mummy</button>
                <button className="button red text-lg">mummy_armor1</button>
                <button className="button red text-lg">mummy_armor2</button>
                <button className="button red text-lg">tomb_raiser</button>
                <button className="button text-lg">explorer</button>
                <button className="button text-lg">ra</button>
                <button className="button text-lg">mummy_armor4</button>
                <button className="button text-lg">egypt_gargantuar</button>
              </div>
            </details>
          </details>
          <details className="details">
            <summary className="summary">Stage 2</summary>
          </details>
          <details className="details">
            <summary className="summary">Stage 3</summary>
          </details> */}
        </div>

        <div className="w-7/12 h-full">
          <Editor
            height="100%"
            defaultLanguage="json"
            value={JSON.stringify(zombossCode, null, 2)}
            theme="vs-dark"
            options={{
              readOnly: false,
              minimap: { enabled: true },
              fontSize: 18,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    );
}

export default ZombossModal