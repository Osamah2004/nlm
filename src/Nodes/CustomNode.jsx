import { useInternalNode } from '@xyflow/react';
import { useAtomValue } from 'jotai';
import { displayPosition } from '../Atom';

export default function CustomNode({ id, data }) {
    const internalNode = useInternalNode(id);
    const isPositionDisplayed = useAtomValue(displayPosition);
    const absolutePosition = internalNode?.internals.positionAbsolute;
    
    const headerClass = data.isFlagWave 
        ? "bg-red-500 text-white pl-1 text-2xl font-bold" 
        : "bg-cyan-500 pl-1 text-2xl font-bold";
    
    return (
        <div className="rounded-xl overflow-hidden bg-white">
            {data.label !== "Initial Board" &&
                <header className={headerClass}>
                    {data.label}
                    {isPositionDisplayed &&
                    <span className="text-gray-600 font-light text-sm">
                    x: {absolutePosition?.x?.toFixed?.(0) ?? '—'}, 
                    y: {absolutePosition?.y?.toFixed?.(0) ?? '—'}
                    </span>
                    }
                </header>
            }
            <div>
                {data.children}
            </div>
        </div>
    );
}