import { useEffect, useRef, useState } from "react"

export default function NumberInput(props) {
    // Option 1: Memoized with proper hook ordering
    const [value, setValue] = useState(() => {
    // Check sessionStorage first
    if (props.label === 'Additional Plantfood') return 0;
    const stored = sessionStorage.getItem(props.label);
    if (stored !== null) return Number(stored);
    
    // Then check for default prop
    if (props.default !== undefined) return props.default;
    
    // Special case for Additional Plantfood
    
    // Fallback
    return 0;
    });
    const isFirstRender = useRef(true);
    const isNotDebounced = JSON.parse(sessionStorage.getItem('Remove wave settings debouncing')) || false;

    useEffect(() => {
        if (isFirstRender.current) {
        isFirstRender.current = false; // Set to false after the first render
        return; // Skip the effect's logic for this run
        }
        sessionStorage.setItem(props.label,value)
        if (props.local === true) localStorage.setItem(props.label,value)
        if (!props.setter) return
        if (isNotDebounced) {
            props.setter(value);
            return;
        }
        const timeout = setTimeout(() => {
            props.setter(value)
        }, 500) // wait 500ms after typing stops

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <div className="flex pl-1 py-2 group hover:bg-cyan-50 transition-colors duration-200">
            <label className="mr-1" htmlFor={props.id}>
                {props.label}:
            </label>

            <input
                value={value}
                min={props.min}
                step={props.step}
                type="number"
                onChange={(e) => setValue(e.target.value)}
                id={props.id}
                className="nodrag nowheel"
            />
        </div>
    )
}