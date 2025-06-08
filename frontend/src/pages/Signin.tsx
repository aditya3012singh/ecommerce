import { Auth } from "../components/Auth";

export const Signin=()=>{

    return <div className="min-h-screen bg-gradient-to-b from-black to-gray-600">
        <div className=""><Auth type={"signin"}/></div>
    </div>
}