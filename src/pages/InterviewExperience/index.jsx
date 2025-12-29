import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchinterviewExperience } from '../../redux/slices/interviewExperienceSlice';
import { data } from 'react-router-dom';

const InterviewExperiences = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user)
  
  const { data: experiences, interviewexperienceloading } = useSelector((state) => state.interviewExperience);
  
  // Filter states
  const [companySearch, setCompanySearch] = useState('');
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  // Modal state
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [hasMore, setHasMore] = useState(true);
  
  // Dynamic job roles from data
  const jobRoles = React.useMemo(() => {
    if (!experiences || experiences.length === 0) return [];
    const roles = experiences.map(exp => exp.job_role).filter(Boolean);
    return [...new Set(roles)].sort();
  }, [experiences]);
  
  const difficulties = ['Easy', 'Medium', 'Hard'];
  
  // Experience levels matching your backend filter logic
  const experienceLevels = [
    { label: '0-1 years', value: '0-1' },
    { label: '1-3 years', value: '1-3' },
    { label: '3-5 years', value: '3-5' },
    { label: '5-10 years', value: '5-10' },
    { label: '10+ years', value: '10+' }
  ];

  // Sorting options
  const sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Most Popular', value: 'popular' },
    
  ];

  const [experience, setExperience] = useState({
  company: '',
  job_role: '',
  location: '',
  years_of_experience: '',
  linkedin_profile: '',
  salary: '',
  interview_date: '',
  difficulty: '',
  rounds: [''],
  questions_asked: '',
  overall_experience: '',
  tips: '',
  offer_received: false,
  is_anonymous: false
});


  // Debounced fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters = {
        company: companySearch || undefined,
        job_role: selectedJobRole || undefined,
        difficulty: selectedDifficulty || undefined,
        experience_level: selectedExperienceLevel || undefined,
        sort_by: sortBy,
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage // We'll request exactly 12 items
      };
      
      dispatch(fetchinterviewExperience(filters));
    }, 300);

    return () => clearTimeout(timer);
  }, [companySearch, selectedJobRole, selectedDifficulty, selectedExperienceLevel, sortBy, currentPage, dispatch]);

  // Check if there are more pages when data changes
  useEffect(() => {
    if (experiences && experiences.length < itemsPerPage) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [experiences]);

  const openModal = () => {

    if(!user)
    {
      navigate("/login")
    }
    else
    {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormErrors({});
    document.body.style.overflow = 'auto';
  };

  const handleResetFilters = () => {
    setCompanySearch('');
    setSelectedJobRole('');
    setSelectedDifficulty('');
    setSelectedExperienceLevel('');
    setSortBy('recent');
    setCurrentPage(1);
    setHasMore(true);
  };

  // Calculate total pages based on hasMore
  const totalPages = currentPage + (hasMore ? 1 : 0);

  // Get difficulty color classes
  const getDifficultyClass = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-50 border-green-200 text-green-700';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'hard': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle next page
  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    if (!experience.company.trim()) {
      errors.company = 'Company name is required';
    }
    
    if (!experience.job_role.trim()) {
      errors.job_role = 'Job role is required';
    }
    
    if (!experience.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!experience.years_of_experience) {
      errors.years_of_experience = 'Years of experience is required';
    }
    
    if (!experience.interview_date.trim()) {
      errors.interview_date = 'Interview date is required';
    }
    
    if (!experience.difficulty) {
      errors.difficulty = 'Interview difficulty is required';
    }
    
    // Validate rounds (at least one non-empty round)
    const validRounds = experience.rounds.filter(round => round.trim() !== '');
    if (validRounds.length === 0) {
      errors.rounds = 'At least one interview round is required';
    }
    
    // Validate questions_asked (minimum 50 characters)
    if (!experience.questions_asked.trim()) {
      errors.questions_asked = 'Questions asked is required';
    } else if (experience.questions_asked.trim().length < 50) {
      errors.questions_asked = 'Questions asked must be at least 50 characters';
    }
    
    // Validate overall_experience (minimum 100 characters)
    if (!experience.overall_experience.trim()) {
      errors.overall_experience = 'Overall experience is required';
    } else if (experience.overall_experience.trim().length < 100) {
      errors.overall_experience = 'Overall experience must be at least 100 characters';
    }
    
    return errors;
  };

  const addExperience = async () => {
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const res = await fetch("http://localhost:5000/api/interview-experiences", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...experience,
          rounds: experience.rounds.filter(round => round.trim() !== '')
        })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Unable to create experience");
      }

      const data = await res.json(); 
      console.log("Experience added:", data);
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Reset form and close modal after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        closeModal();
        
        // Reset form
        setExperience({
          company: '',
          job_role: '',
          location: '',
          years_of_experience: '',
          linkedin_profile: '',
          salary: '',
          interview_date: '',
          difficulty: '',
          rounds: [''],
          questions_asked: '',
          overall_experience: '',
          tips: '',
          offer_received: false,
          is_anonymous: false
        });
        
        // Refetch experiences to show the new one
        const filters = {
          company: companySearch || undefined,
          job_role: selectedJobRole || undefined,
          difficulty: selectedDifficulty || undefined,
          experience_level: selectedExperienceLevel || undefined,
          sort_by: sortBy,
          skip: 0,
          limit: itemsPerPage
        };
        dispatch(fetchinterviewExperience(filters));
      }, 3000);
      
    } catch (error) {
      console.error("Error adding experience:", error.message);
      setFormErrors({ submit: error.message });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
       <div  className="max-w-7xl mx-auto px-6">
        <div className="container mx-auto px-4 mt-6">
          <div className="bg-[#0b53e3] rounded-2xl shadow-lg shadow-blue-900/10 border border-blue-700/30 overflow-hidden">
            <div className="px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">

                {/* Left */}
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold mb-0.5">
                      Interview Experiences
                    </h1>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium">
                      Real insights from tech interviews
                    </p>
                  </div>
                </div>

                {/* Right */}
                <button onClick={openModal} className="cursor-pointer group relative bg-white text-blue-600 hover:bg-blue-50 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Share Your Experience
                  <div className="absolute -bottom-1 left-1/2 w-3/4 h-1 bg-blue-600/30 rounded-full blur-sm transform -translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                  </button>

              </div>
            </div>
          </div>
        </div>



        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 md:py-8 -mt-3 relative z-20">
          {/* Search and Filters Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-5 md:p-6 mb-8 transition-all duration-300 hover:shadow-xl">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  Find Interview Experiences
                </h2>
                <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <span className="font-medium text-gray-700">{experiences.length}</span> experiences on this page
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider">
                  Search Company
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter company name (e.g., Druva, Google, Amazon)..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-400 bg-gray-50"
                  />
                  <div className="absolute right-3 top-2.5">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-5">
                {/* Job Role Filter */}
                <div>
                  <label className="block text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Job Role
                  </label>
                  <div className="relative">
                    <select
                      value={selectedJobRole}
                      onChange={(e) => setSelectedJobRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 appearance-none"
                    >
                      <option value="">All Roles</option>
                      {jobRoles.map((role) => (
                        <option key={role} value={role} className="text-xs">{role}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Difficulty
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 appearance-none"
                    >
                      <option value="">All Difficulties</option>
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty} className="text-xs">{difficulty}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Experience Level
                  </label>
                  <div className="relative">
                    <select
                      value={selectedExperienceLevel}
                      onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 appearance-none"
                    >
                      <option value="">All Levels</option>
                      {experienceLevels.map((level) => (
                        <option key={level.value} value={level.value} className="text-xs">{level.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sorting Filter */}
                <div>
                  <label className="block text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 appearance-none"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value} className="text-xs">{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    onClick={handleResetFilters}
                    className="cursor-pointer w-full px-4 py-2 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold flex items-center justify-center gap-2 bg-white"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {interviewexperienceloading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-3 text-gray-600 text-xs">Loading experiences...</p>
            </div>
          )}

          {/* Experiences Grid */}
          {!interviewexperienceloading && experiences.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {experiences.map((experience) => (
                  <div
                    key={experience._id}
                    onClick={()=>{
                      navigate(`/interview-experiences/${experience._id}`);
                    }}
                    className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-50 hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Top corner accent */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-2xl"></div>
                    
                    {/* Company Header */}
                    <div className="flex items-start gap-3 mb-4 relative z-10">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-blue-700 font-bold text-xs">
                            {experience.company?.charAt(0) || 'C'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 truncate mb-0.5">
                              {experience.company}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">{experience.job_role}</p>
                          </div>
                          {experience.offer_received && (
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-full text-[10px] font-semibold">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Offer
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Experience Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center mr-2">
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Location</div>
                            <div className="text-xs text-gray-700 truncate">{experience.location || 'N/A'}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center mr-2">
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Date</div>
                            <div className="text-xs text-gray-700">{experience.interview_date}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center mr-2">
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Experience</div>
                            <div className="text-xs text-gray-700">{experience.years_of_experience} yrs</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center mr-2">
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Rounds</div>
                            <div className="text-xs text-gray-700">{experience.rounds?.length || 0}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer with Stats */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-semibold border ${getDifficultyClass(experience.difficulty)}`}>
                            {experience.difficulty}
                          </span>
                          <span className="text-[10px] text-gray-400">difficulty</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                          </svg>
                          <span className="text-xs">{experience.helpful_count}</span>
                          <span className="text-[10px] text-gray-400 ml-1">helpful</span>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between">
                        <span>Click to view details →</span>
                        <span>{formatDate(experience.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination - Fixed to show 12 items and detect no more pages */}
              <div className="flex flex-col items-center py-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`cursor-pointer px-4 py-2 text-xs border rounded-lg flex items-center gap-2 ${currentPage === 1 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Previous
                  </button>
                  
                  <div className="flex items-center">
                    <span className="px-4 py-2 text-xs bg-blue-50 text-blue-600 rounded-lg font-semibold">
                      Page {currentPage}
                    </span>
                    {!hasMore && experiences.length > 0 && (
                      <span className="ml-3 px-3 py-1 text-[10px] bg-gray-100 text-gray-600 rounded-full">
                        No more results
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={!hasMore}
                    className={`cursor-pointer px-4 py-2 text-xs border rounded-lg flex items-center gap-2 ${!hasMore ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="text-[10px] text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                  Showing {experiences.length} of 12 experiences per page
                  {!hasMore && <span className="ml-2 text-blue-500">• No further results available</span>}
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!interviewexperienceloading && experiences.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">No interview experiences found</h3>
              <p className="text-gray-500 text-xs mb-6 max-w-md mx-auto">Try adjusting your filters or search for a different company</p>
              <button
                onClick={handleResetFilters}
                className="cursor-pointer px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 shadow-sm hover:shadow"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

          </div>
      </div>

      


{/* Share Experience Modal */}
{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div 
      className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Experience Shared Successfully!</h3>
            <p className="text-gray-600 mb-2">Thank you for contributing to the community.</p>
            <p className="text-sm text-gray-500">Redirecting in a few seconds...</p>
          </div>
        </div>
      )}

      {/* Modal Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Share Your Interview Experience</h2>
              <p className="text-blue-100 text-sm">Help others learn from your journey</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="cursor-pointer text-white hover:text-gray-200 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Modal Content - Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <form className="space-y-6">
          {/* Company and Job Role Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-2">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Google"
                value={experience.company}
                onChange={(e) => {
                  setExperience({...experience, company: e.target.value});
                  if (formErrors.company) {
                    setFormErrors({...formErrors, company: null});
                  }
                }}
                className={`w-full px-4 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  formErrors.company ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.company && (
                <p className="mt-1 text-xs text-red-500">{formErrors.company}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-2">
                Job Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Software Engineer"
                value={experience.job_role}
                onChange={(e) => {
                  setExperience({...experience, job_role: e.target.value});
                  if (formErrors.job_role) {
                    setFormErrors({...formErrors, job_role: null});
                  }
                }}
                className={`w-full px-4 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  formErrors.job_role ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.job_role && (
                <p className="mt-1 text-xs text-red-500">{formErrors.job_role}</p>
              )}
            </div>
          </div>

          {/* Location and Experience Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., San Francisco, CA"
                value={experience.location}
                onChange={(e) => {
                  setExperience({...experience, location: e.target.value});
                  if (formErrors.location) {
                    setFormErrors({...formErrors, location: null});
                  }
                }}
                className={`w-full px-4 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  formErrors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.location && (
                <p className="mt-1 text-xs text-red-500">{formErrors.location}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-2">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 3"
                value={experience.years_of_experience}
                onChange={(e) => {
                  setExperience({...experience, years_of_experience: e.target.value});
                  if (formErrors.years_of_experience) {
                    setFormErrors({...formErrors, years_of_experience: null});
                  }
                }}
                className={`w-full px-4 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  formErrors.years_of_experience ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.years_of_experience && (
                <p className="mt-1 text-xs text-red-500">{formErrors.years_of_experience}</p>
              )}
            </div>
          </div>

          {/* LinkedIn and Salary Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-2">
                LinkedIn Profile (Optional)
              </label>
              <input
                type="url"
                placeholder="https://www.linkedin.com/in/yourprofile"
                value={experience.linkedin_profile}
                onChange={(e) => setExperience({...experience, linkedin_profile: e.target.value})}
                className="w-full px-4 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-2">
                Salary/Package (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., $120,000 - $150,000 or ₹20 LPA"
                value={experience.salary}
                onChange={(e) => setExperience({...experience, salary: e.target.value})}
                className="w-full px-4 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
          </div>

          {/* Interview Date and Difficulty Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-2">
                Interview Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., October 2024"
                value={experience.interview_date}
                onChange={(e) => {
                  setExperience({...experience, interview_date: e.target.value});
                  if (formErrors.interview_date) {
                    setFormErrors({...formErrors, interview_date: null});
                  }
                }}
                className={`w-full px-4 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  formErrors.interview_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.interview_date && (
                <p className="mt-1 text-xs text-red-500">{formErrors.interview_date}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-2">
                Interview Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                value={experience.difficulty}
                onChange={(e) => {
                  setExperience({...experience, difficulty: e.target.value});
                  if (formErrors.difficulty) {
                    setFormErrors({...formErrors, difficulty: null});
                  }
                }}
                className={`w-full px-4 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  formErrors.difficulty ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              {formErrors.difficulty && (
                <p className="mt-1 text-xs text-red-500">{formErrors.difficulty}</p>
              )}
            </div>
          </div>

          {/* Interview Rounds */}
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-2">
              Interview Rounds <span className="text-red-500">*</span>
            </label>
            {formErrors.rounds && (
              <p className="mb-2 text-xs text-red-500">{formErrors.rounds}</p>
            )}
            <div className="space-y-2">
              {experience.rounds.map((round, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Online Assessment, Technical Round 1, etc."
                    value={round}
                    onChange={(e) => {
                      const newRounds = [...experience.rounds];
                      newRounds[index] = e.target.value;
                      setExperience({...experience, rounds: newRounds});
                      if (formErrors.rounds) {
                        setFormErrors({...formErrors, rounds: null});
                      }
                    }}
                    className="flex-1 px-4 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                  {index === experience.rounds.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setExperience({...experience, rounds: [...experience.rounds, '']})}
                      className="cursor-pointer px-4 py-2.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      + Add Round
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const newRounds = experience.rounds.filter((_, i) => i !== index);
                        setExperience({...experience, rounds: newRounds});
                        if (formErrors.rounds) {
                          setFormErrors({...formErrors, rounds: null});
                        }
                      }}
                      className="cursor-pointer px-4 py-2.5 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Questions Asked */}
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-2">
              Questions Asked <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">
                ({experience.questions_asked.length}/50 characters minimum)
              </span>
            </label>
            <textarea
              placeholder="Describe the questions asked in each round..."
              value={experience.questions_asked}
              onChange={(e) => {
                setExperience({...experience, questions_asked: e.target.value});
                if (formErrors.questions_asked) {
                  setFormErrors({...formErrors, questions_asked: null});
                }
              }}
              rows={4}
              className={`w-full px-4 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                formErrors.questions_asked ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.questions_asked && (
              <p className="mt-1 text-xs text-red-500">{formErrors.questions_asked}</p>
            )}
          </div>

          {/* Overall Experience */}
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-2">
              Overall Experience <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">
                ({experience.overall_experience.length}/100 characters minimum)
              </span>
            </label>
            <textarea
              placeholder="Share your overall interview experience..."
              value={experience.overall_experience}
              onChange={(e) => {
                setExperience({...experience, overall_experience: e.target.value});
                if (formErrors.overall_experience) {
                  setFormErrors({...formErrors, overall_experience: null});
                }
              }}
              rows={4}
              className={`w-full px-4 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                formErrors.overall_experience ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.overall_experience && (
              <p className="mt-1 text-xs text-red-500">{formErrors.overall_experience}</p>
            )}
          </div>

          {/* Tips & Advice */}
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-2">
              Tips & Advice (Optional)
            </label>
            <textarea
              placeholder="Share any tips or advice for future candidates..."
              value={experience.tips}
              onChange={(e) => setExperience({...experience, tips: e.target.value})}
              rows={3}
              className="w-full px-4 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="offer_received"
                checked={experience.offer_received}
                onChange={(e) => setExperience({...experience, offer_received: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="offer_received" className="ml-2 text-xs text-gray-700">
                ✓ Offer Received
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_anonymous"
                checked={experience.is_anonymous}
                onChange={(e) => setExperience({...experience, is_anonymous: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_anonymous" className="ml-2 text-xs text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                Post Anonymously (your name will be hidden)
              </label>
            </div>
          </div>

          {/* Submit error */}
          {formErrors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600">{formErrors.submit}</p>
            </div>
          )}
        </form>
      </div>

      {/* Modal Footer */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500">
            All fields marked with <span className="text-red-500">*</span> are required
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="cursor-pointer px-5 py-2.5 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addExperience}
              className="cursor-pointer px-5 py-2.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 shadow-sm hover:shadow"
            >
              Submit Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default InterviewExperiences;