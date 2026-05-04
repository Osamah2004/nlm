import { useState, useEffect, useRef } from "react"

export default function TextInput(props) {
    const [value, setValue] = useState(props.default ?? '')
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // Set to false after the first render
            return; // Skip the effect's logic for this run
        }
        sessionStorage.setItem(props.label,value)
        if (!props.setter) return

        const timeout = setTimeout(() => {
            props.setter(value)
        }, 500) // wait 500ms after typing stops

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <div title={props.title} className="flex pl-1 py-2 group hover:bg-cyan-50 transition-colors duration-200">
            <label className="mr-1" htmlFor={props.id}>
                {props.label}:
            </label>

            <input
                value={value}
                type="text"
                placeholder={props.placeholder}
                onChange={(e) => setValue(e.target.value)}
                id={props.id}
                className={`nodrag ${props.full == true && 'full'}`}
            />
        </div>
    )
}