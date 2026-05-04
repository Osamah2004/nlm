import { useReactFlow, ReactFlowProvider } from '@xyflow/react';
import Checkbox from '../Inputs/CheckboxInput';
import { displayPosition } from '../Atom';
import { useSetAtom } from 'jotai';
import { useState,useEffect } from 'react';
import NumberInput from '../Inputs/NumberInput';

const NodesLayout = () => {
    const setDisplayPosition = useSetAtom(displayPosition)
    const reactFlowInstance = useReactFlow();
    const nodes = reactFlowInstance.getNodes()

    const setVisibility = (e,i) => {
        let temp = [...nodes].filter(f => !f.id.startsWith('wave'))
        temp[i].data.isHidden = e
        localStorage.setItem(`n${i+1}-invisibility`,e)
        console.log(temp)
    }

    const hiddenNodes = (e) => {
        let temp = [...nodes].filter(f => !f.id.startsWith('wave'))
        temp.forEach((_,i) => {
            temp[i].data.isHidden = e;
            document.getElementById(`n${i+1}-visibility`).checked = e
        })
        temp.forEach((_,i) => localStorage.setItem(`n${i+1}-invisibility`,e))
    }

    const savePositions = () => {
        let temp = [...nodes].filter(f => !f.id.startsWith('wave'))
        temp.forEach((e,i) => localStorage.setItem(`n${i+1}-position`,JSON.stringify(e.position)))
    }

    const resetPositions = () => Array.from({length:nodes.length}).forEach((_,i) => localStorage.removeItem(`n${i+1}-position`))

    return (
      <div className="w-250 h-250 text-black text-xl relative">
        <header className="w-full text-4xl pb-2 bg-cyan-500 font-bold">
          Page layout
        </header>

        <Checkbox
          label={"Display node positions"}
          onChange={() =>
            setDisplayPosition(
              !JSON.parse(sessionStorage.getItem("Display node positions")),
            )
          }
        />
        <Checkbox label='Remove wave settings debouncing'/>
        <p className='text-sm text-gray-600'>Enabling this will remove the delay after changing Wave Count's value</p>
        <p className='text-sm text-gray-600 mb-2'>Which causes a lot of re-rendering in a short span of time especially when you use mouse scroll for changing number inputs</p>
        <table className='w-full'>
          <thead className="bg-cyan-500 text-left">
            <tr>
              <th className="">node name</th>
              <th className="">x</th>
              <th>y</th>
              <th>hidden</th>
            </tr>
          </thead>
          <tbody>
            {nodes
              .filter((f) => !f.id.startsWith("wave"))
              .map((e,i) => (
                <tr key={e.id} className="border-b even:bg-cyan-100 even:hover:bg-cyan-200 transition-colors duration-300">
                    <td className="text-left">{e.data.label}</td>
                    <td className="text-left">{Math.ceil(e.position.x)}</td>
                    <td className="text-left">{Math.ceil(e.position.y)}</td>
                    <td>
                        <label className='block w-full group' htmlFor={`${e.id}-visibility`}>
                            <input
                                defaultChecked={JSON.parse(localStorage.getItem(`n${i+1}-invisibility`)) === true}
                                onChange={(e) => setVisibility(e.target.checked,i)}
                                id={`${e.id}-visibility`} className='group-hover:border-cyan-500 w-5 translate-y-0.5' type="checkbox" />
                        </label>
                    </td>
                </tr>
              ))}
          </tbody>
        </table>
        <p className='text-lg text-gray-600 mt-2'>clicking a node's header then pressing an arrow key will move it 5 pixels</p>
        <p className='text-lg text-gray-600'>doing that while holding shift moves it 20 pixles instead</p>
        {/*       
        const firstWavePosition = {x:0,y:200}
        const wavesPerGroup = 5
        const distanceBetweenGroups = -350
        const distanceBetweenWavesInsideGroup = 250 */}
        <p className='mt-2 text-2xl font-medium'>Wave nodes positioning:</p>
        <div className="grid grid-cols-2">
            <NumberInput local={true} step={50} default={0} label={'Node wave 1 x position'}/>
            <NumberInput local={true} step={50} default={200} label={'Node wave 1 y position'}/>
            <NumberInput local={true} step={1} default={5} min={1} label={'nodes per group'}/>
            <NumberInput local={true} step={50} default={-350} label={'distance between groups'}/>
            <NumberInput local={true} step={50} default={-250} label={'distance between nodes inside group'}/>
        </div>

        <footer className='absolute flex bg-gray-300 bottom-0 py-2 w-full'>
            <div className="ml-auto mr-2 space-x-2">
                <button className="button p-1 text-lg" onClick={() => savePositions()}>save positions</button>
                <button className="button p-1 text-lg red" onClick={() => resetPositions()}>reset positions</button>
                <button className="button p-1 text-lg" onClick={() => hiddenNodes(false)}>show all</button>
                <button className="button p-1 text-lg red" onClick={() => hiddenNodes(true)}>hide all</button>
            </div>
        </footer>
      </div>
    );
}

export default NodesLayout;