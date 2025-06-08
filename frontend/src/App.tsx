import { useState } from 'react'
import './App.css'
import { Signup } from './pages/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Product } from './pages/Product'
import  Home  from './pages/Home'
function App() {
 

  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/" element={<Home/>}/>
            
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/Product" element={<Product/>}/>
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
