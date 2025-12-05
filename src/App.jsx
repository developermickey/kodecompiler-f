import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import GuestEditor from './pages/GuestEditor'
import Arena from './pages/Arena'
import Welcome from './pages/User/Welcome'
import PrivacyPolicy from './pages/PrivacyPolicy'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/guest-editor" element={<GuestEditor />} />
        <Route path="/problems" element={<Arena />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
       
        <Route path="/welcome" element={<Welcome />} />
        <Route path="*" element={<NotFound />} />

         

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App