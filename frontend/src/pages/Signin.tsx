import { Auth } from "../components/Auth";

export const Signin=()=>{
    return <div className="min-h-screen bg-gradient-to-b from-black  via-emerald-950 to-black">
        <div className=""><Auth type={"signin"}/></div>
    </div>
}