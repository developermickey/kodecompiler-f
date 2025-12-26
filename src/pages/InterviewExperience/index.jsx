import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchinterviewExperience } from '../../redux/slices/interviewExperienceSlice';
import { data } from 'react-router-dom';

const InterviewExperiences = () => {
  const dispatch = useDispatch();
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
    { label: 'Most Helpful', value: 'helpful' }
  ];

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

  const handleCardClick = (experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExperience(null);
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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl">
          <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Interview Experiences</h1>
                </div>
                
                <p className="text-blue-100 text-sm md:text-base mb-6 leading-relaxed max-w-xl">
                  Real experiences from top tech companies. Learn from actual interview stories, 
                  filter by company, role, difficulty, and experience level.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-2">
                  
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    Real Companies
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    Verified Stories
                  </span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <button className="group relative bg-white text-blue-600 hover:bg-blue-50 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Share Your Experience
                  <div className="absolute -bottom-1 left-1/2 w-3/4 h-1 bg-blue-600/30 rounded-full blur-sm transform -translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                </button>
                <p className="text-blue-200 text-xs mt-3 text-center">Help others in their journey</p>
              </div>
            </div>
          </div>
          
          {/* Decorative bottom curve */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-blue-50 to-transparent"></div>
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
                    className="w-full px-4 py-2 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold flex items-center justify-center gap-2 bg-white"
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
                    onClick={() => handleCardClick(experience)}
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
                    className={`px-4 py-2 text-xs border rounded-lg flex items-center gap-2 ${currentPage === 1 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
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
                    className={`px-4 py-2 text-xs border rounded-lg flex items-center gap-2 ${!hasMore ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
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
                className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 shadow-sm hover:shadow"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 tracking-wider">MASTER THE NEXT GENERATION CODING INTERVIEW</h3>
              <p className="text-gray-300 text-xs mb-6 max-w-2xl mx-auto leading-relaxed">
                We help thousands of developers ace their coding interviews with real-world problems, 
                expert solutions, and hands-on practice from top tech companies.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-xs transition duration-200 shadow-md hover:shadow-lg">
                  Start practicing free
                </button>
                <button className="bg-transparent border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white px-5 py-2 rounded-lg font-semibold text-xs transition duration-200">
                  Try guest compiler
                </button>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-400 text-[10px]">
                  <div className="flex items-center gap-1">
                    <span className="flex items-center">
                      ★★★★★ <span className="ml-1 text-gray-300">4.8/5 rating</span>
                    </span>
                  </div>
                  <div className="hidden sm:block text-gray-600">•</div>
                  <span>No credit card required</span>
                  <div className="hidden sm:block text-gray-600">•</div>
                  <span>Free forever plan</span>
                </div>
                <div className="mt-4 text-gray-500 text-[10px]">
                  © {new Date().getFullYear()} Interview Experiences. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup for Detailed View */}
      {isModalOpen && selectedExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {selectedExperience.company?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedExperience.company}</h2>
                    <p className="text-blue-100 text-sm">{selectedExperience.job_role}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 mt-4">
                {selectedExperience.offer_received && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Offer Received
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyClass(selectedExperience.difficulty)}`}>
                  {selectedExperience.difficulty} Difficulty
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                  {selectedExperience.years_of_experience} years experience
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                  {selectedExperience.helpful_count} helpful votes
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Interview Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        </svg>
                        <div>
                          <div className="text-[10px] text-gray-500">Location</div>
                          <div className="text-xs font-medium">{selectedExperience.location || 'Not specified'}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <div>
                          <div className="text-[10px] text-gray-500">Interview Date</div>
                          <div className="text-xs font-medium">{selectedExperience.interview_date}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                          <div className="text-[10px] text-gray-500">Posted</div>
                          <div className="text-xs font-medium">{formatDate(selectedExperience.created_at)}</div>
                        </div>
                      </div>
                       
                       {selectedExperience.salary && selectedExperience.salary !== null && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                            <div className="text-[10px] text-gray-500">Salary</div>
                            <div className="text-xs font-medium">
                                {typeof selectedExperience.salary === 'number' 
                                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedExperience.salary)
                                : selectedExperience.salary}
                            </div>
                            </div>
                        </div>
                        )}
                    </div>
                  </div>
                  
                  {/* Rounds */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Interview Rounds ({selectedExperience.rounds?.length || 0})</h3>
                    <div className="space-y-2">
                      {selectedExperience.rounds?.map((round, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-2">
                            {index + 1}
                          </div>
                          <span className="text-xs">{round}</span>
                        </div>
                      )) || <p className="text-xs text-gray-500">No rounds specified</p>}
                    </div>
                  </div>
                </div>

                {/* Middle Column - Questions Asked */}
                <div className="md:col-span-2">
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Questions Asked</h3>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      {selectedExperience.questions_asked || 'No questions details provided.'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Overall Experience</h3>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      {selectedExperience.overall_experience || 'No overall experience details provided.'}
                    </div>
                  </div>
                  
                  {selectedExperience.tips && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Tips & Advice
                      </h3>
                      <div className="text-xs text-green-800 leading-relaxed">
                        {selectedExperience.tips}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex flex-wrap justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-4">Posted by: <span className="font-medium">{selectedExperience.is_anonymous ? 'Anonymous' : selectedExperience.username}</span></span>
                    <span>Experience shared on: {formatDate(selectedExperience.created_at)}</span>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <button className="flex items-center text-blue-600 hover:text-blue-700 mr-4">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                      </svg>
                      Helpful ({selectedExperience.helpful_count})
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  Close
                </button>
                <div className="text-xs text-gray-500">
                  Found this helpful? Consider sharing your own experience!
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