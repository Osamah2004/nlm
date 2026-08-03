import React, { useState,useMemo, useCallback, useEffect, useRef } from 'react';
import { Background, ReactFlowProvider, BackgroundVariant, ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import CustomNode from './Nodes/CustomNode';
import BoardNode from './Nodes/BoardNode';
import NumberInput from './Inputs/NumberInput'; 
import TextInput from './Inputs/TextInput';
import SelectInput from './Inputs/SelectInput';
import SelectLists from './assets/SelectLists.json'
import GenerateLevel from './GenerateLevel';
import { useNodeUpdates } from './hooks/UseNodeUpdates';
import ZombieSpawn from './LevelParts/ZombieSpawn';
import ZombieSelector from './LevelParts/ZombiePool';
import ZombieHotkeys from './LevelParts/ZombieHotkeys';
import LevelPreview from './LevelPreview';
import Version from './Version';
import Modal from 'react-modal';
import zombies from './assets/ZombieTypes.json'
import plantTypes from './assets/PlantTypes.json'
import Checkbox from './Inputs/CheckboxInput';
import GameCode from './GameCode';
import SeedbankModal from './SeedBank/SeedbankModal';
import AirRaid from './LevelParts/AirRaid';
import Narrative from './Narrative';
import { useHotkeys } from 'react-hotkeys-hook';
import LevelEvents from './LevelParts/LevelEvents';
import Conveyor from './SeedBank/Conveyor';
import CustomPlantModal from './SeedBank/CustomPlantModal';
import Miscellaneous from './LevelParts/Miscellaneous';
import NodesLayout from './Nodes/NodeLayout';
import Escalation from './LevelParts/Escalation';
import Campaign from './Campaign';
import { RgbColorPicker } from 'react-colorful';

const initialEdges = [];

const nodeTypes = {
  custom: CustomNode,
  board: BoardNode
}

Modal.setAppElement('#root');

const reset = () => {
  const fontSize = sessionStorage.getItem('fontSize') || 14
  localStorage.clear()
  sessionStorage.clear()

  //version
  localStorage.setItem('nlm-version','1.3.1')
  sessionStorage.setItem('fontSize',fontSize)
  window.location.reload()
}

const FogColorPicker = ({ fogColor, setFogColor, onClose }) => {
  return (
    <div className="h-74 w-60">
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-1">
          <strong className="text-red-500">R: {Math.round(fogColor.r)}</strong>
          <strong className="text-green-500">G: {Math.round(fogColor.g)}</strong>
          <strong className="text-blue-500">B: {Math.round(fogColor.b)}</strong>
        </div>
        <button 
          onClick={onClose}
          className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
        >
          ✕
        </button>
      </div>
      <button className="button" onClick={() => setFogColor({r:255,g:255,b:255})}>default</button>
      <RgbColorPicker className='m-4' color={fogColor} onChange={setFogColor}/>
    </div>
  );
};
export default function App() {
  //for every update, increment the version in reset/useEffect/setChildModal/generateLevel/index.html
  const [levelName, setLevelName] = useState(sessionStorage.getItem('Name') || 'blank');
  const [waveCount, setWaveCount] = useState(parseInt(sessionStorage.getItem('Wave Count')) || 10);
  const [flagInterval, setFlagInterval] = useState(parseInt(sessionStorage.getItem('Flag Interval')) || 5);
  const [boardTracker, setBoardTracker] = useState([])
  const [selectedBoardItem, setSelectedBoardItem] = useState(null);
  const [headerVisibility,setHeaderVisibility] = useState(true)
  const [childModal, setChildModal] = useState((localStorage.getItem('nlm-version') == '1.3.1' ? false : <Version/>));
  const [fogColor,setFogColor] = useState(JSON.parse(sessionStorage.getItem('fogColor')) || {r:0,g:0,b:0})
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fogFirstRender = useRef(true)

  const plants = plantTypes.objects.map(e=>e.aliases[0])

  useEffect(() => {
    if (fogFirstRender.current) {
      fogFirstRender.current = false
      return
    }
    sessionStorage.setItem('fogColor',JSON.stringify(fogColor))
  }
  ,[fogColor])

  useEffect(() => {
  //version
    localStorage.setItem('nlm-version','1.3.1');
    localStorage.setItem('has mowers',true);
    sessionStorage.setItem('SunDropper','DefaultSunDropper');
  },[])
  const DebouncedInput = ({ value: initialValue, onChange, delay = 300, placeholder = "Search...", className = "" }) => {
    const [value, setValue] = useState(initialValue || '')

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, delay)

      return () => clearTimeout(timeout)
    }, [value, delay, onChange])

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`nodrag w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:border-blue-400 outline-0 transition-colors ${className}`}
      />
    )
  }
  // Function to generate wave nodes based on count and interval
const BoardGroup = ({ group, summary }) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredGroup = useMemo(() => {
    if (!searchTerm) return group
    return group.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [group, searchTerm])

  return (
    <details className='details'>
      <summary className={`summary`}>
          {summary}
        {searchTerm && `(filtered: ${filteredGroup.length}/${group.length})`}
      </summary>
      
      <div className="p-2">
        <DebouncedInput 
          value={searchTerm}
          onChange={setSearchTerm}
          delay={300}
          placeholder="Filter items..."
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2 p-2 max-h-48 overflow-y-auto overflow-x-hidden">
        {filteredGroup.map((e, i) => (
          <button
            className="button w-[175.737px]"
            key={i}
            onClick={() => {
              localStorage.setItem("board-item", e);
              setSelectedBoardItem(e)
              setBoardTracker(prev => {
                const newTracker = [...prev, e];
                return newTracker;
              });
            }}
          >
            {e}
          </button>
        ))}
        
        {filteredGroup.length === 0 && (
          <div className="col-span-3 text-center py-4 text-gray-500">
            No items match "{searchTerm}"
          </div>
        )}
      </div>
    </details>
  )
}
  const getStoredNumber = (key, defaultValue) => {
    const value = sessionStorage.getItem(key);
    return value !== null ? Number(value) : defaultValue;
  }
  const generateWaveNodes = useCallback((count, interval) => {
    return Array.from({ length: count }, (_, i) => {
      const waveNumber = i + 1;
      const isFlagWave = waveNumber % interval === 0;



      const firstWavePosition = {
        x: getStoredNumber('Node wave 1 x position', 0),
        y: getStoredNumber('Node wave 1 y position', 200)
      }
      const wavesPerGroup = Number(sessionStorage.getItem('nodes per group')) || 5
      const distanceBetweenGroups = Number(sessionStorage.getItem('distance between groups')) || -350
      const distanceBetweenWavesInsideGroup = Number(sessionStorage.getItem('distance between nodes inside group')) || 250
      
      return {
        id: `wave-${waveNumber}`,
        position: {
          x: firstWavePosition.x + (distanceBetweenGroups * Math.floor((i) / wavesPerGroup)), // Arrange in columns of 15
          y: firstWavePosition.y + (i % wavesPerGroup) * distanceBetweenWavesInsideGroup // Stack vertically
        },
        type: 'custom',
        style: { 
          width: 300,
          opacity: 1,
          pointerEvents: 'auto',
          visibility: 'visible'
        },
        data: { 
          label: `Wave ${waveNumber}`,
          isFlagWave: isFlagWave,
          waveNumber: waveNumber,
          flagInterval: interval
        }
      };
    });
  }, []);
  const positionFromLocal = (key,x,y) => JSON.parse(localStorage.getItem(`n${key}-position`)) || {x:x,y:y}
  const getVisibility = (i) => JSON.parse(localStorage.getItem(`n${i}-invisibility`)) === true
  const initialNodes = [
    {
      id: 'n1',
      hidden: getVisibility(1),
      //
      position: positionFromLocal('1',-425,-180),
      type: "custom",
      data: {
        label: 'Planks',
        children: (
          <>
          <Checkbox checked={sessionStorage.getItem('row1') == 'true'} label='row1'/>
          <Checkbox checked={sessionStorage.getItem('row2') == 'true'} label='row2'/>
          <Checkbox checked={sessionStorage.getItem('row3') == 'true'} label='row3'/>
          <Checkbox checked={sessionStorage.getItem('row4') == 'true'} label='row4'/>
          <Checkbox checked={sessionStorage.getItem('row5') == 'true'} label='row5'/>
          </>
        )
      }
    },
    {
      id: 'n2',
      hidden: getVisibility(2),
      //
      position: positionFromLocal('2',250,25),
      type: "custom",
      data: {
        label: 'InitialTide',
        children: (
          <>
            <NumberInput
              label={'InitialTide'}
              default={-1}
              min={-1}
            />
            <NumberInput
              label={'BowlingFoulLine'}
              default={-1}
              min={-1}
            />
            <Checkbox label='HideTideMarker'/>
          </>
        )
      }
    },
    // {
    //   id: 'air_raid',
    //   position: { x: 900, y: 650 },
    //   type: "custom",
    //   data: {
    //     label: 'Air Raid',
    //     children: (
    //       <>
    //           <AirRaid/>
    //       </>
    //     )
    //   }
    // },
{
  id: 'n3',
  hidden: getVisibility(3),
  //
  position: positionFromLocal('3',-325,-180),
  type: "custom",
  data: {
    label: 'ShipProps',
    children: (
      <>
        <Checkbox
          checked={JSON.parse(sessionStorage.getItem('Enable custom ship')) == true}
          label='Enable custom ship'
        />
        <NumberInput step={500} min={500} default={20000} label={"Toughness"} />
        <NumberInput step={500} min={0} default={10000} label={"ToughnessShield"} />
        <Checkbox checked={JSON.parse(sessionStorage.getItem('ForceShielded')) == true}  label='ForceShielded'/>
        <Checkbox checked={JSON.parse(sessionStorage.getItem('ForceUnshielded')) == true}  label='ForceUnshielded'/>
        <NumberInput step={100} min={0} default={3500} label={"BloverDPS"} />
        <NumberInput step={0.25} min={0} default={3} label={"BloverSPS"} />
        <NumberInput step={0.25} min={0} default={2.5} label={"EdgeX"} />
      </>
    )
  }
},


    {
      id: 'n4',
      hidden: getVisibility(4),
      //
      position: positionFromLocal('4',1800,-450),
      type: "custom",
      data: {
        label: 'Board Items',
        children: (
          <>
          <div className="max-h-96 nowheel w-xl overflow-y-auto">
            <BoardGroup color={'borad-group1'} group={SelectLists.GridItems.filter(e=>e.startsWith('gravestone'))} summary="Gravestones" />
            <BoardGroup color={'borad-group2'} group={SelectLists.GridItems.filter(e=>e.startsWith('rail'))} summary="Rails/Carts" />
            <BoardGroup color={'borad-group3'} group={SelectLists.GridItems.filter(e=>e.startsWith('powertile'))} summary="Powertiles" />
            <BoardGroup color={'borad-group4'} group={SelectLists.GridItems.filter(e=>!(e.startsWith('rail') || e.startsWith('gravestone') || e.startsWith('powertile')))} summary="Other grid items" />
            <BoardGroup color={'borad-group5'} group={plants.map(e=>`P_${e}`)} summary="Initial plants" />
            <BoardGroup color={'borad-group6'} group={plants.map(e=>`SOS_${e}`)} summary="Endangered plants" />
            <BoardGroup color={'borad-group7'} group={plants.map(e=>`F_${e}`)} summary="Frozen plants" />
            <BoardGroup color={'borad-group8'} group={zombies.objects.map(e=>e.aliases[0]).map(e=>`FZ_${e}`)} summary="Frozen zombies" />
            <p className="text-gray-500 p-1">Vases positions are hardcoded to be randomized.</p>
            <p className="text-gray-500 p-1">And there's no workaround for that.</p>
            <BoardGroup color={'borad-group7'} group={plants.map(e=>`VP_${e}`)} summary="Vase plants" />
            <BoardGroup color={'borad-group8'} group={zombies.objects.map(e=>e.aliases[0]).map(e=>`VZ_${e}`)} summary="Vase zombies" />
            <NumberInput min={0} label={'NumColoredPlantVases'}/>
            <p className="text-gray-500 p-1">This is hardcoded to spawn vase garg.</p>
            <NumberInput min={0} label={'NumColoredZombieVases'}/>
            <button className="button w-full p-2 text-2xl" onClick={() => localStorage.setItem('board-item','point-1')}>SplinePoints</button>
            <p className="text-gray-500 p-1">pressing it again will reset it to 1</p>
            <hr />
            <button className="button w-full p-2 text-2xl mt-2" onClick={() => localStorage.setItem('board-item','all-alone_')}>all alone position</button>
            <button className="button w-full p-2 text-2xl mt-2" onClick={() => localStorage.setItem('board-item','wire_')}>TNT wire</button>
            <p className="py-2 font-bold bg-cyan-300 my-2">Cannons away paths</p>
            <p className="text-gray-500 mb-2">Will automatically enable cannons away</p>
            <p className="text-gray-500 mb-2">TD mode instead if a point is behind x3</p>
            <p className="text-gray-500 mb-2">For advanced settings, go to Miscellaneous.</p>
            <div className="space-y-1">
              <button className="button w-full p-2 text-2xl" onClick={() => localStorage.setItem('board-item','Row1_p1')}>Row 1</button>
              <button className="button w-full p-2 text-2xl" onClick={() => localStorage.setItem('board-item','Row2_p1')}>Row 2</button>
              <button className="button w-full p-2 text-2xl" onClick={() => localStorage.setItem('board-item','Row3_p1')}>Row 3</button>
              <button className="button w-full p-2 text-2xl" onClick={() => localStorage.setItem('board-item','Row4_p1')}>Row 4</button>
              <button className="button w-full p-2 text-2xl" onClick={() => localStorage.setItem('board-item','Row5_p1')}>Row 5</button>
            </div>
            <button className="button w-full p-2 text-2xl mt-2" onClick={() => localStorage.setItem('board-item','fog_')}>fog</button>
            <button 
              className="button w-full p-2 text-2xl mt-2" 
              onClick={() => setShowColorPicker(true)}
            >
              fog color
            </button>
            <Checkbox label='offscreen fog'/>
          </div>
          </>
        )
      }
    },
    {
      id: 'n5',
      hidden: getVisibility(5),
      //
      position: positionFromLocal('5',-50,-180),
      type: "custom",
      data: {
        label: 'Level Definition',
        children: (
          <>
              <TextInput label="Name" setter={setLevelName} default={sessionStorage.getItem('Name') || ''}/>
              <TextInput label="Author" default={sessionStorage.getItem('Author') || ''}/>
              <TextInput label="Description" default={sessionStorage.getItem('Description') || ''}/>
              <SelectInput list={SelectLists.worlds} default={sessionStorage.getItem('Stage') || 'TutorialStage'} label="Stage" id="stage" />
              <SelectInput list={SelectLists.sunDroppers} placeholder="Sun drop rate" default="DefaultSunDropper" label="SunDropper" id="SunDropper" />
              <SelectInput list={SelectLists.mowers} placeholder="Select a lawn mower" default={sessionStorage.getItem('Mower') || "TutorialMowers"} label="Mower" id="Mower" />
              <NumberInput default={50} min={0} step={25} label={'StartingSun'}/>
          </>
        )
      }
    },
    {
      id: 'n6',
      hidden: getVisibility(6),
      //
      position: positionFromLocal('6',570,20),
      type: "custom",
      data: {
        label: 'Wave Settings',
        children: (
          <>
            <NumberInput min={1} default={10} label={"Wave Count"} setter={setWaveCount}/>
            <NumberInput min={1} default={5} label={"Flag Interval"} setter={setFlagInterval}/>
            <NumberInput min={-1} default={-1} label={"First wave countdown"}/>
            <NumberInput min={-1} default={-1} label={"Flag wave delay"}/>
            <Checkbox label={"SuppressFlagZombie"}/>
            <TextInput title="Type either 1 or 0 here, 1 = veteran, 0 = normal,&#10; eg: '0101' will put a normal flag zombie in flags 1,3 and veteran in flags 2,4" default={sessionStorage.getItem("Veteran flag override") || ''} label={"Veteran flag override"}/>
          </>
        )
      }
    },
    {
      id: 'n7',
      hidden: getVisibility(7),
      //
      position: positionFromLocal('7',900,0),
      type: "custom",
      data: {
        label: 'Zombie Pool',
        children: (
          <ZombieSelector modalFunction={setChildModal}/>
        )
      }
    },
    {
      id: 'n8',
      hidden: getVisibility(8),
      //
      position: positionFromLocal('8',-1100,-110),
      type: "custom",
      data: {
        label: 'Zombie Hotkeys',
        children: (
          <ZombieHotkeys/>
        )
      }
    },
    {
      id: 'n9',
      hidden: getVisibility(9),
      //
      position: positionFromLocal('9',630,-450),
      type: "custom",
      data: {
        label: "Initial Board",
        default: 'Initial Board',
        children: (
          <>
            <BoardNode />
          </>
        )
      }
    },
    {
      id: 'n10',
      hidden: getVisibility(10),
      //
      position: positionFromLocal('10',900,1200),
      type: "custom",
      data: {
        label: 'Objectives',
        children: (
          <>
            <p className='pl-1 text-gray-500 '>Zeros are ignored</p>
<Checkbox
checked={JSON.parse(sessionStorage.getItem('Add challenge to level moduels'))}
label='Add challenge to level moduels'/>
            <hr />
            <div className="max-h-50 nowheel overflow-y-auto">
              <NumberInput min={0} label={"Sun production target"} step={50}/>
              <NumberInput min={0} label={"Sun spending limit"} step={50}/>
              <NumberInput min={0} label={"Sun holdout seconds"} step={5}/>
              <NumberInput min={0} label={"Max plant loss"}/>
              <NumberInput min={0} label={"Plant limit"}/>
              <NumberInput min={0} label={"Flower column"}/>
<p className='pl-1 border-t border-b border-black text-gray-500'>Defeat X zombies in X seconds</p>
              <NumberInput min={0} label={"Time"} step={5}/>
              <NumberInput min={0} label={"Zombies to kill"} step={5}/>
<p className='pl-1 border-t border-b border-black text-gray-500'>Last stand</p>
              <NumberInput min={0} label={"Starting sun"} step={100}/>
              <NumberInput min={0} label={"Starting pf"}/>

            </div>
          </>
        )
      }
    },
    {
      id: 'n11',
      hidden: getVisibility(11),
      //
      position: positionFromLocal('11',900,1500),
      type: "custom",
      data: {
        label: 'Seedbank',
        children: (
          <>
            <NumberInput label={'OverrideSeedSlotsCount'} min={0}/>
            <Checkbox label='Locked and loaded' checked={JSON.parse(sessionStorage.getItem('isPreset') == 'true')}/>
            <Checkbox label='add one hit kill' checked={JSON.parse(sessionStorage.getItem('add one hit kill') == 'true')}/>
            <Checkbox label='UnlockAll'/>
            <div className="flex space-x-1 p-1">
              <button onClick={() => setChildModal(<SeedbankModal  listType={1}/>)} className='button' >preset list</button>
              <button onClick={() => setChildModal(<SeedbankModal  listType={2}/>)} className='button' >include list</button>
              <button onClick={() => setChildModal(<SeedbankModal  listType={3}/>)} className='button' >exclude list</button>
              <button onClick={() => setChildModal(<CustomPlantModal/>)} className='button' >custom plants</button>
            </div>
          </>
        )
      }
    },
    {
      id: 'n12',
      hidden: getVisibility(12),
      //
      position: positionFromLocal('12',1220,1200),
      type: "custom",
      data: {
        label: 'Events/Ambushes',
        children: (
          <>
            <LevelEvents />
          </>
        )
      }
    },
    {
      id: 'n13',
      hidden: getVisibility(13),
      //
      position: positionFromLocal('13',250,-180),
      type: "custom",
      data: {
        label: 'Pinata',
        children: (
          <>
            <Checkbox label='Enable Pinata Party'/>
            <NumberInput step={50} min={0} label='Starting points'/>
            <NumberInput step={50} min={0} label='Point increment'/>
            <NumberInput min={0} label='Pf to spawn count'/>
          </>
        )
      }
    },
    {
      id: 'n14',
      hidden: getVisibility(14),
      //
      position: positionFromLocal('14',900,650),
      type: "custom",
      data: {
        label: 'Conveyor',
        children: (
          <>
            <Conveyor />
          </>
        )
      }
    },
    {
      id: 'n15',
      hidden: getVisibility(15),
      //
      position: positionFromLocal('15',2025,650),
      type: "custom",
      data: {
        label: 'Miscellaneous',
        children: (
          <Miscellaneous modalFunction={setChildModal}/>
        )
      }
    },
    {
      id: 'n16',
      hidden: getVisibility(16),
      //
      position: positionFromLocal('16',2430,-450),
      type: "custom",
      data: {
        label: 'Escalation',
        children: (
          <Escalation />
        )
      }
    },
    ...generateWaveNodes(waveCount, flagInterval)
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { updateNodeData, updateNode } = useNodeUpdates(setNodes);
  const [asideVisibility, setAsideVisibility] = useState(false);

  // Initialize selected item when boardTracker changes
  useEffect(() => {
    if (boardTracker.length > 0 && !selectedBoardItem) {
      setSelectedBoardItem(boardTracker[boardTracker.length-1]);
    }
  }, [boardTracker, selectedBoardItem]);

  // Update wave nodes when waveCount changes (add/remove waves)
  useEffect(() => {
    setNodes(prevNodes => {
      const nonWaveNodes = prevNodes.filter(node => !node.id.startsWith('wave-'));
      const newWaveNodes = generateWaveNodes(waveCount, flagInterval);
      return [...nonWaveNodes, ...newWaveNodes];
    });
  }, [waveCount, generateWaveNodes, flagInterval]);

  // Update flag wave status when flagInterval changes
  useEffect(() => {
    for (let i = 1; i <= waveCount; i++) {
      const waveId = `wave-${i}`;
      const isFlagWave = i % flagInterval === 0;
      
      updateNodeData(waveId, (oldData) => ({
        ...oldData,
        isFlagWave: isFlagWave,
        flagInterval: flagInterval,
        children: (
          <>
            <ZombieSpawn wave={i}/>
          </>
        )
      }));
    }
  }, [flagInterval, waveCount, updateNodeData]);
 
  // Add this after your other useEffect hooks
useEffect(() => {
  const handleWindowWheel = (e) => {
    if (!asideVisibility || boardTracker.length === 0) return;
    
    
    const delta = e.deltaY > 0 ? 1 : -1; // Scroll down = next, scroll up = previous
    
    let currentIndex = selectedBoardItem ? boardTracker.indexOf(selectedBoardItem) : -1;
    let newIndex;
    
    if (currentIndex === -1) {
      // No item selected, select first or last based on scroll direction
      newIndex = delta > 0 ? 0 : boardTracker.length - 1;
    } else {
      // Calculate new index with wrap-around
      newIndex = currentIndex + delta;
      if (newIndex >= boardTracker.length) {
        newIndex = 0; // Wrap to first
      } else if (newIndex < 0) {
        newIndex = boardTracker.length - 1; // Wrap to last
      }
    }
    
    const newSelectedItem = boardTracker[newIndex];
    setSelectedBoardItem(newSelectedItem);
    localStorage.setItem('board-item', newSelectedItem);
  };

  // Add event listener when aside is visible
  if (asideVisibility) {
    window.addEventListener('wheel', handleWindowWheel, { passive: false });
  }

  // Cleanup
  return () => {
    window.removeEventListener('wheel', handleWindowWheel);
  };
}, [asideVisibility, boardTracker, selectedBoardItem]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
  
  const downloadJson = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = levelName ? `${levelName}.json` : 'blank.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const generated = () => GenerateLevel()

  
  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      padding: 0,
      border: 'none',
      background: 'transparent',
      maxWidth: '90vw',
      maxHeight: '90vh',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
    },
  };
/*
const createNode = (comp) => {
  const ambushTrack = () => {
    const currentNum = parseInt(localStorage.getItem('ambush_num')) || 0;
    const newNum = currentNum + 1;
    localStorage.setItem('ambush_num', newNum);
    return newNum;
  };
  const newNode = {
    id: `ambush-${comp}-${Date.now()}`,
    position: { x: 0, y: 0 },
    type: "custom",
    data: {
      label: `Ambush-${ambushTrack()}`,
      children: (
        comp
      )
    }
  }
  setNodes((n) => [...nodes,newNode])
}

*/

  // hotkeys
  useHotkeys('f8',() => setHeaderVisibility(!headerVisibility),{preventDefault:true})
  useHotkeys('f1',() => downloadJson(generated(), levelName),{preventDefault:true})
  useHotkeys('f2',() => setChildModal(<LevelPreview/>),{preventDefault:true})
  useHotkeys('f3',() => setChildModal(<Version/>),{preventDefault:true})
  useHotkeys('f4',() => setChildModal(<GameCode/>),{preventDefault:true})
  useHotkeys('f5',() => setAsideVisibility(!asideVisibility),{preventDefault:true})
  useHotkeys('f6',() => setChildModal(<Narrative/>),{preventDefault:true})
  useHotkeys('f7',() => {
    if (confirm('Are you sure you want to clear data?')){
      reset()
    }
  },{preventDefault:true})

const processFile = (file) => {
  if (!file) return;

  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      if (!Array.isArray(data) || data.length !== 2) {
        alert('JSON file must contain an array of exactly 2 objects');
        return;
      }
      
      Object.entries(data[0]).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      
      Object.entries(data[1]).forEach(([key, value]) => {
        if (typeof value === 'string') {
          sessionStorage.setItem(key, value);
        } else {
          sessionStorage.setItem(key, JSON.stringify(value));
        }
      });
      window.location.reload();
    } catch (error) {
      alert('Error parsing JSON file: ' + error.message);
    }
  };
  
  reader.readAsText(file);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  processFile(file);
};
const handleDragOver = (e) => {
  e.preventDefault();
};
const handleDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.name.endsWith('.json')) {
    processFile(file);
  } else {
    alert('Please drop a JSON file');
  }
};

  const storageToObject = (storage) => {
    const obj = {};
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      try {
        // Try to parse stored JSON values back to objects
        obj[key] = JSON.parse(storage.getItem(key));
      } catch {
        obj[key] = storage.getItem(key);
      }
    }
    return obj;
  };

  //version
  return (
    <ReactFlowProvider>
      <div onDragOver={handleDragOver} onDrop={(e) => handleDrop(e)} style={{ width: '100vw', height: '100vh' }} className='overflow-hidden'>
        <header className={`absolute space-x-2 ${headerVisibility ? 'flex' : 'hidden'} z-10 pl-2 py-2 bg-gray-950/70 w-full`}>
          <h1 className='text-white font-mono'>NLM v1.3</h1>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="json-upload"
          />
          <button className='px-0.5 button' onClick={() => downloadJson(generated(), levelName)}>download level<span className='block text-xs text-center opacity-70'>F1</span></button>
          <button className='px-0.5 button' onClick={() => setChildModal(<LevelPreview/>)}>Level Preview<span className='block text-xs text-center opacity-70'>F2</span></button>
          <button className='px-0.5 button' onClick={() => setChildModal(<Version/>)}>Change log<span className='block text-xs text-center opacity-70'>F3</span></button>
          <button className='px-0.5 button' onClick={() => setChildModal(<GameCode/>)}>Gardendless' code<span className='block text-xs text-center opacity-70'>F4</span></button>
          <button className='px-0.5 button' onClick={() => setAsideVisibility(!asideVisibility)}>Latest board items<span className='block text-xs text-center opacity-70'>F5</span></button>
          <button className='px-0.5 button' onClick={() => setChildModal(<Narrative/>)}>Dialogue<span className='block text-xs text-center opacity-70'>F6</span></button>
          <button className='px-0.5 button' onClick={() => downloadJson([storageToObject(localStorage),storageToObject(sessionStorage)],`${levelName || 'blank'}Data`)}>Export Data<span className='block text-xs text-center opacity-70'></span></button>
          <button className='px-0.5 button' onClick={() => document.getElementById('json-upload').click()}>Import Data<span className='block text-xs text-center opacity-70'></span></button>
          <button className='px-0.5 button' onClick={() => setChildModal(<NodesLayout/>)}>Page layout</button>
          <button className='px-0.5 bg-red-600 hover:bg-red-800 transition-colors rounded text-white cursor-pointer' onClick={reset}>clear data<span className='block text-xs text-center opacity-70'>F7</span></button>
        </header>
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          minZoom={0.25}
          fitView
        >
          <Background
            id="1"
            gap={20}
            color="#f1f1f1"
            bgColor='#1f1f1f'
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>

  <Modal
    isOpen={childModal !== false}
    onRequestClose={() => setChildModal(false)}
    style={modalStyles}
    contentLabel="Example Modal"
    parentSelector={() => document.body}
    ariaHideApp={false}
  >
    <div className="bg-white">
      {childModal}
    </div>
  </Modal>
        
<Modal
  isOpen={showColorPicker}
  onRequestClose={() => setShowColorPicker(false)}
  style={modalStyles}
  contentLabel="Color Picker"
  parentSelector={() => document.body}
  ariaHideApp={false}
>
  <div className="bg-white">
    <FogColorPicker 
      fogColor={fogColor} 
      setFogColor={setFogColor}
      onClose={() => setShowColorPicker(false)}
    />
  </div>
</Modal>
        {/* Aside with transition */}
        <aside 
          className={`absolute right-0 top-0 h-full bg-gray-200/30 pl-2 pt-18 transition-all duration-300 ease-in-out ${
            asideVisibility ? 'opacity-100' : 'hidden opacity-0'
          }`}
          style={{ width: '250px', overflowY: 'auto' }}
        >
          {boardTracker.length > 0 ? (
            <ol className='list-decimal space-y-1'>
              {boardTracker.map((e, index) => (
                <li 
                  key={index}
                  className={`block p-2 cursor-pointer transition-colors duration-200 ${
                    selectedBoardItem === e ? 'bg-cyan-600 font-bold' : 'bg-cyan-200 hover:bg-cyan-300'
                  }`}
                  onClick={() => {
                    setSelectedBoardItem(e);
                    localStorage.setItem('board-item', e);
                  }}
                >
                  {e}
                </li>
              ))}
            </ol>
          ) : (
            <p className="p-4">No board items yet</p>
          )}
        </aside>
      </div>
    </ReactFlowProvider>
  );
}

