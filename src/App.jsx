import React, {lazy,Suspense} from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/loader" 

import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const GuestEditor = lazy(() => import("./pages/GuestEditor"));

const Arena = lazy(()=> import("./pages/Arena"));
const Problem = lazy(()=> import("./pages/Problem"));

const Welcome = lazy(() => import("./pages/User/Welcome"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));

const WeeklyChallenges = lazy(()=>import("./pages/WeeklyChallenges"))
const ContestStartPage = lazy(() =>import("./pages/WeeklyChallenges/ContestStartPage"));

const MainCompiler = lazy(() => import("./pages/MainEditor"));
const LoginGuard = lazy(() => import("./pages/Login/LoginGuard"));
const ContestQuestion = lazy(() =>import("./pages/WeeklyChallenges/ContestQuestions"));

const InterviewExperiences = lazy(() =>
  import("./pages/InterviewExperience")
);
const SelectedExperience = lazy(() =>
  import("./pages/InterviewExperience/selectedExperience")
);
const ProfileComponent = lazy(() =>
  import("./pages/Account/Index")
);



const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<Loader/>}>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Arena />} />
        <Route
          path="/interview-experiences"
          element={<InterviewExperiences />}
        />
        <Route
          path="/interview-experiences/:experienceId"
          element={<SelectedExperience />}
        />
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
        <Route path="/account" element={<ProfileComponent />} />
        <Route path="/weekly-challenges" element={<WeeklyChallenges />} />
        <Route path="/challenge/:id/start" element={<ContestQuestion />} />
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
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default App;