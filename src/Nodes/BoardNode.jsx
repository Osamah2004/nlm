import { useEffect, useState, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const Bin = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
)

export default function BoardNode({ data, id }) {
    // Access default name from data.default
    const [error, setError] = useState("")
    const [hoveredCell, setHoveredCell] = useState(null);
    const [boardItem,setBoardItem] = useState(localStorage.getItem('board-item') || '')
    const [rows,setRows] = useState(JSON.parse(localStorage.getItem('cannonsAwayPaths')) || [
        [],
        [],
        [],
        [],
        [],
    ])
// Inside your BoardNode component:
const cellStorage = JSON.parse(localStorage.getItem('initialBoard'))
const [cellItems, setCellItems] = useState(cellStorage || {})

const addToRow = (row,position) => {
    let temp = [...rows]
    temp[row-1].push(position)
    setRows(temp)
}

const handleCellClick = (e, row, column) => {
    e.preventDefault() // Prevent default behavior
    const boardItem = localStorage.getItem('board-item')
    const cellKey = `${row}-${column}`

    if (boardItem.startsWith('point')) {
        const getNum = Number(boardItem.slice(6))
        localStorage.setItem('board-item',`point-${getNum+1}`)
    }
    
    if (boardItem.startsWith('Row')) {
        const getNum = Number(boardItem.slice(6))
        const splineRow = boardItem.charAt(3)
        localStorage.setItem('board-item',`Row${splineRow}_p${getNum+1}`)
        addToRow(splineRow,{x:((column)*65)+230,y:((row)*77.5)+200})
    }
    
    setCellItems(prev => ({
        ...prev,
        [cellKey]: [...(prev[cellKey] || []), boardItem]
    }))
}
// Add this after your other useEffects
useEffect(() => {
    // Function to update boardItem from localStorage
    const updateBoardItem = () => {
        setBoardItem(localStorage.getItem('board-item') || '');
    };
    
    // Listen for storage events (works across tabs/windows)
    window.addEventListener('storage', (e) => {
        if (e.key === 'board-item') {
            setBoardItem(e.newValue || '');
        }
    });
    
    // Polling fallback for same-tab changes (if needed)
    const interval = setInterval(updateBoardItem, 100);
    
    // Initial load
    updateBoardItem();
    
    return () => {
        clearInterval(interval);
        window.removeEventListener('storage', updateBoardItem);
    };
}, []);
const getZombieHotkeyAssignments = () => {
    const assignments = localStorage.getItem('zombieHotkeyAssignments');
    return assignments ? JSON.parse(assignments) : {};
};
// This creates dynamic hotkeys for all keys in the assignment object
// Replace your existing useEffect with this one:

useEffect(() => {
    const handleKeyPress = (e) => {
        if (!hoveredCell) return;
        
        const key = e.key;
        const assignments = getZombieHotkeyAssignments();
        const zombieCode = assignments[key]?.code;
        
        if (zombieCode) {
            const { row, column } = hoveredCell;
            const cellKey = `${row}-${column}`;
            
            setCellItems(prev => ({
                ...prev,
                [cellKey]: [...(prev[cellKey] || []), zombieCode]
            }));
        }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
}, [hoveredCell]);
const clearBoard = () => {
    setCellItems({})
    setRows([
        [],
        [],
        [],
        [],
        [],
    ])
}

useEffect(() => {
    localStorage.setItem('cannonsAwayPaths', JSON.stringify(rows))
}, [rows])

const handleCellRightClick = (e, row, column) => {
    e.preventDefault() // Prevent context menu
    const cellKey = `${row}-${column}`

    
    setCellItems(prev => {
        const newItems = { ...prev }
        if (newItems[cellKey]?.length > 0) {
            // Remove the last item
            newItems[cellKey] = newItems[cellKey].slice(0, -1)
            // Delete the key if array becomes empty
            if (newItems[cellKey].length === 0) {
                delete newItems[cellKey]
            }
        }
        return newItems
    })
}

    // Extract board index from node id

    useEffect(() => {
        localStorage.setItem(`initialBoard`,JSON.stringify(cellItems))
    },[cellItems])

    return (
        <div className="rounded-xl overflow-hidden bg-white w-6xl shadow-lg z-0 nowheel">
            {/* Cyan Header */}
            <header className={`pl-1 flex text-2xl font-bold bg-cyan-500`}>
                Initial Board 
                <button className='button red mx-4 rounded-none' onClick={() => clearBoard()}><Bin/></button>
                {boardItem.length > 0 ? `board item: ${boardItem}` : ''}
            </header>
            {/* 5x9 Grid */}
            <p className="pl-3 mb-1 text-gray-400">Left click to add a board item, Right click to remove it.</p>
            <div className="px-3 pb-3">
                <div className="grid grid-cols-9 gap-2">
{Array(5).fill(0).map((_, row) => (
    Array(9).fill(0).map((_, column) => {
        const cellKey = `${row}-${column}`
        const items = cellItems[cellKey] || []
        
        return (
            <div
                key={cellKey}
                data-row={row}
                data-column={column}
                onClick={(e) => handleCellClick(e, row, column)}
                onContextMenu={(e) => handleCellRightClick(e, row, column)}
                onMouseEnter={() => setHoveredCell({ row, column })}  // ADD THIS
                onMouseLeave={() => setHoveredCell(null)}              // ADD THIS
                className="font-extralight h-16 w-28 text-xs bg-gray-200 overflow-y-auto rounded-sm hover:bg-gray-300 cursor-pointer transition-colors p-1 overflow-hidden"
            >
                <span className="text-xs bg-cyan-100 rounded block mb-1">
                    y{row} : x{column}
                </span>
                {items.length > 0 && (
                    <ul className="list-none text-[10px]">
                        {items.map((item, idx) => (
                            <li key={idx} className="truncate">
                                • {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
    })
))}
                </div>
            </div>

        </div>
    )
}