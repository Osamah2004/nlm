import React, { useState, useEffect, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

const ZombieHotkeys = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = sessionStorage.getItem('zombiePoolHotkeys_page');
    return savedPage !== null ? parseInt(savedPage, 10) : 0;
  });
  
  const [zombiePool, setZombiePool] = useState([]);
  const [pressedKey, setPressedKey] = useState(null);
  const itemsPerPage = 12;

  // Key mapping for the 12 positions
  const keyMap = [
    '1', '2', '3', '4',
    'q', 'w', 'e', 'r',
    'a', 's', 'd', 'f'
  ];

  // Load zombie pool from sessionStorage
  const loadZombiePool = useCallback(() => {
    const savedPool = sessionStorage.getItem('zombiePool');
    if (savedPool) {
      try {
        const parsed = JSON.parse(savedPool);
        setZombiePool(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Error parsing zombie pool', e);
        setZombiePool([]);
      }
    } else {
      setZombiePool([]);
    }
  }, []);

  // Update hotkey assignments in localStorage whenever page changes or pool changes
  useEffect(() => {
    const startIndex = currentPage * itemsPerPage;
    const visibleZombies = zombiePool.slice(startIndex, startIndex + itemsPerPage);
    
    // Create hotkey assignment object
    const hotkeyAssignments = {};
    keyMap.forEach((key, index) => {
      const zombie = visibleZombies[index];
      if (zombie) {
        hotkeyAssignments[key] = zombie;
      }
    });
    
    // Save to localStorage
    localStorage.setItem('zombieHotkeyAssignments', JSON.stringify(hotkeyAssignments));
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('hotkeyAssignmentsUpdated', { 
      detail: hotkeyAssignments 
    }));
  }, [currentPage, zombiePool, keyMap]);

  // Load initially and set up listeners
  useEffect(() => {
    loadZombiePool();

    const handleStorageChange = (e) => {
      if (e.key === 'zombiePool') {
        loadZombiePool();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handlePoolUpdate = () => loadZombiePool();
    window.addEventListener('zombiePoolUpdated', handlePoolUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('zombiePoolUpdated', handlePoolUpdate);
    };
  }, [loadZombiePool]);

  // Save current page to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('zombiePoolHotkeys_page', currentPage);
  }, [currentPage]);

  // Clear pressed key after animation
  useEffect(() => {
    if (pressedKey) {
      const timer = setTimeout(() => {
        setPressedKey(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pressedKey]);

  // Calculate pagination
  const totalPages = Math.ceil(zombiePool.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleZombies = zombiePool.slice(startIndex, startIndex + itemsPerPage);

  // Keyboard navigation
  useHotkeys('ctrl+q', (e) => {
    e.preventDefault();
    setCurrentPage(prev => Math.max(0, prev - 1));
  }, { enableOnFormTags: true, preventDefault: true });

  useHotkeys('ctrl+e', (e) => {
    e.preventDefault();
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  }, { enableOnFormTags: true, preventDefault: true });

  // Listen for hotkey presses from ZombieSpawn
  useHotkeys('1,2,3,4,q,w,e,r,a,s,d,f', (e, handler) => {
    const key = handler.keys?.[0] || '';
    
    // Check if the active element is an input
    const activeElement = document.activeElement;
    const isInput = activeElement?.tagName === 'INPUT' || 
                    activeElement?.tagName === 'TEXTAREA' || 
                    activeElement?.isContentEditable;
    
    if (isInput) return;
    
    e.preventDefault();
    setPressedKey(key);
  }, { enableOnFormTags: false, preventDefault: true });

  return (
    <div className="p-2">
      {/* Zombie Pool Display */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">
            Pool: {zombiePool.length} zombies
          </span>
          <span className="text-xs text-gray-500">
            Page {currentPage + 1}/{totalPages || 1}
          </span>
        </div>

        {/* Keyboard Grid */}
        <div className="grid grid-cols-4 gap-1 mb-3">
          {keyMap.map((key, index) => {
            const zombie = visibleZombies[index];
            const isPressed = pressedKey === key;
            
            let bgColor = 'bg-gray-100';
            let borderColor = 'border-gray-200';
            let textColor = 'text-gray-400';
            
            if (zombie) {
              if (isPressed) {
                bgColor = 'bg-cyan-500';
                borderColor = 'border-cyan-600';
                textColor = 'text-white';
              } else {
                bgColor = 'bg-gray-50';
                borderColor = 'border-gray-300';
                textColor = 'text-gray-700';
              }
            }
            
            return (
              <div
                key={`${key}-${index}`}
                className={`
                  border rounded p-1 text-center text-xs transition-all duration-150
                  ${bgColor} ${borderColor}
                  ${zombie && !isPressed ? 'hover:bg-gray-100 cursor-pointer' : ''}
                  ${isPressed ? 'scale-105 shadow-lg' : ''}
                `}
                title={zombie ? `${zombie.world} - ${zombie.code}` : 'Empty slot'}
              >
                <span className={`font-mono font-bold block ${zombie ? (isPressed ? 'text-white' : 'text-gray-500') : 'text-gray-400'}`}>
                  {key}
                </span>
                {zombie ? (
                  <span className={`font-mono truncate block ${textColor}`} title={zombie.code}>
                    {zombie.code}
                  </span>
                ) : (
                  <span className="text-gray-300">---</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Hotkey Legend */}
        <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t">
          <span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-xs">Ctrl+Q</kbd> Prev
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-xs">Ctrl+E</kbd> Next
          </span>
        </div>
      </div>
    </div>
  );
};

export default ZombieHotkeys;