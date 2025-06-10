
import axios from "axios"
import { useState, type ChangeEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import AppBar from "./AppBar"


export const Auth=({type}:{type: "signup"|"signin"})=>{
    const navigate=useNavigate()
    const [loading, setLoading] = useState(false);

    const [postInput, setPostInput]=useState({
        email:"",
        name:"",
        password:"",
        role:"CUSTOMER"
    })

    async function sendRequest(){
         setLoading(true)
        console.log("hello")
        try {

            const response= await axios.post(`http://localhost:3000/api/v1/${type=="signup"?"signup":"signin"}`,postInput)
            console.log("hello")
            console.log(response.data)
             const token = type === "signup" ? response.data.token : response.data.jwt;
            console.log(token)
            console.log("Response data:", response.data);
            if (token) {
                localStorage.setItem("token", token);
                navigate("/product");
            } else {
                alert("No token received");
        }
        } catch (error) {
            // alert the user that request failed
            alert("Error while signing up")
        }finally{
            setLoading(false)
        }
    }
    return <div >
        <AppBar type={"Login"}/>
        <div className="h-screen flex justify-center flex-col shadow-xl ">
        
        {/* {JSON.stringify(postInput)} */}
        {loading && (
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Processing your request...</span>
            </div>
            )}

        <div className="flex  justify-center  ">
            <div className="border-2 border-solid border-zinc-700  p-5 bg-black rounded-lg shadow-2xl ">
            <div className="px-10 ">
                <div className="text-4xl text-white  font-bold ">
                    {type=="signup"?"Create an account":"Login to Your account"}
                </div>
                <div className="text-slate-400">
                    {type=="signin"?"Dont have an account?":"Already have an account?"}
                    <Link to={type=="signin"?"/signup":"/signin"} className="pl-2 underline">
                        {type=="signin"?"Sign up":"Sign in"}
                    </Link>
                </div>
            </div>
            <div className="pt-1">
                <LabelledInput label="email" placeholder="John@gmail.com" onChange={(e)=>{
                    setPostInput({
                        ...postInput,
                        email: e.target.value
                    })
                }}/>
                {type=="signup"?<LabelledInput label="Name" placeholder="John Doe" onChange={(e)=>{
                    setPostInput ({
                         ...postInput,
                        name: e.target.value
                    })
                }}/>:null}
                <LabelledInput label="password" type={"password"} placeholder="123456" onChange={(e)=>{
                    setPostInput({
                        ...postInput,
                        password: e.target.value
                    })
                }}/>
                <button
                    onClick={sendRequest}
                    type="button"
                    className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    disabled={loading}
                    >
                    {loading ? (
                        <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            />
                            <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                            />
                        </svg>
                        Loading...
                        </div>
                    ) : (
                        type === "signup" ? "Signup" : "Signin"
                    )}
                    </button>

            </div>
        </div>
    </div>
    </div>
    </div>

}


interface LabelledInputType{
    label:string;
    placeholder:string;
    onChange:(e: ChangeEvent<HTMLInputElement>) => void;
    type?:  string
}


function LabelledInput({label, placeholder, onChange,type}:LabelledInputType){
    return <div>
        <div>
            <label className="block mb-2 text-sm  font-bold text-white pt-2">{label}</label>
            <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
             focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200
             dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500
             dark:focus:border-blue-500" placeholder={placeholder} required />
        </div>
    </div>
}