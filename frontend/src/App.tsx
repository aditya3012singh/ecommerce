
import './App.css'
import { Signup } from './pages/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import  Home  from './pages/Home'
function App() {
 

  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/signin" element={<Signin/>}/>
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
