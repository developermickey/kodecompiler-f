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
import Problem from './pages/Problem'
import Welcome from './pages/User/Welcome'
import PrivacyPolicy from './pages/PrivacyPolicy'
import NotFound from './pages/NotFound'
import TermsOfService from './pages/TermsOfService'
import RefundPolicy from './pages/RefundPolicy'
import Disclaimer from './pages/Disclaimer'
import WeeklyChallenges from './pages/WeeklyChallenges'
import ContestStartPage from './pages/WeeklyChallenges/ContestStartPage'
import MainCompiler from "./pages/MainEditor"
import LoginGuard from "./pages/Login/LoginGuard"
import InterviewExperiences from "./pages/InterviewExperience"

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Arena />} />
         <Route path="/interview-experiences" element={<InterviewExperiences/>} />
        <Route path="/problem/:problemId" element={<Problem />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/guest-editor" element={<GuestEditor />} />{" "}
        {/* Explicitly for guests */}
        <Route path="/problems" element={<Arena />} />{" "}
        {/* Usually public so people can browse */}
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Legal Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        {/* 1. User Dashboard / Welcome */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/weekly-challenges" element={<WeeklyChallenges />} />
        <Route path="/challenge/:id" element={<ContestStartPage />} />
        {/* 2. Main Compiler */}
        <Route
          path="/compiler"
          element={
            <LoginGuard
              title="Compiler Locked"
              message="You must be logged in to run and save code."
            >
              <MainCompiler />
            </LoginGuard>
          }
        />
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
