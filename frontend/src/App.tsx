import './App.css';
import { Signup } from './pages/Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Signin } from './pages/Signin';
import Home from './pages/Home';
import { Product } from './pages/Product';
import Contact from './components/Contact';
import About from './components/About';
import Services from './components/Services';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import { SellerHome } from './pages/SellerHome';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/seller" element={<SellerHome/>}/>
          <Route
            path="/product/:id"
            element={

                <Product />

            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
