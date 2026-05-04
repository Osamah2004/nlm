import { useEffect, useRef, useState } from "react"

export default function SelectInput(props){
    const [value, setValue] = useState(sessionStorage.getItem(props.label) ? sessionStorage.getItem(props.label) : '')
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (props.default){
            setValue(props.default)
        }
    },[])

    useEffect(() => {
        if (isFirstRender.current) {
        isFirstRender.current = false; // Set to false after the first render
        return; // Skip the effect's logic for this run
        }
        
        console.log(props.label)
        sessionStorage.setItem(props.label,value)
    }, [value])
    return (
        <div className="flex p-1 group hover:bg-cyan-50 transition duration-200 py-2">
            <label className="mr-1" htmlFor={props.id}>
                {props.label}:
            </label>

            <select
            value={value}
            
            onChange={(e) => setValue(e.target.value)}
            className="bg-gray-300 mr-0 ml-auto outline-0 group-hover:border-blue-400 border-2 transition-colors duration-200 rounded-xl pl-1 border-black "
            id={props.id}>
                <option value="0" hidden>{props.placeholder}</option>
                {props.list.map((e,i) => (
                    <option value={e} key={i}>{e}</option>
                ))}
            </select>
        </div>
    )
}