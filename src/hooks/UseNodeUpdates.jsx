// hooks/useNodeUpdates.js
import { useCallback } from 'react';

export function useNodeUpdates(setNodes) {
  const updateNode = useCallback((nodeId, updater) => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === nodeId) {
          return typeof updater === 'function' 
            ? updater(node)
            : { ...node, ...updater };
        }
        return node;
      })
    );
  }, [setNodes]);

  const updateNodeData = useCallback((nodeId, dataUpdater) => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: typeof dataUpdater === 'function'
              ? dataUpdater(node.data)
              : { ...node.data, ...dataUpdater }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  return { updateNode, updateNodeData };
}