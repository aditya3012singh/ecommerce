import { useState } from 'react'
import './App.css'
import { Signup } from './pages/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Product } from './pages/Product'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
            
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/Product" element={<Product/>}/>
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
