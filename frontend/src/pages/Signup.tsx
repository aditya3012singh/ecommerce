import type { ChangeEvent } from "react";

export const Signup=()=>{
    return <div className="">
        <div>
            <LabelledInput label="Name" placeholder="hello" />
        </div>
    </div>
}


interface LabelledInputType{
    label: string;
    placeholder: string;
    
    type?:  string
}

function LabelledInput({label, placeholder}:LabelledInputType){
    return <div>
        <div>
            <label className="block mb-2 text-sm  font-bold text-gray-900 pt-2">{label}</label>
            <input  id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
             focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200
             dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500
             dark:focus:border-blue-500" placeholder={placeholder} required />
        </div>
    </div>
}