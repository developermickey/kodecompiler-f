import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route to="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App