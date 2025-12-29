import React, { useState, useEffect } from 'react';
import { fetchInterviews } from './mockApi.js';


import { Search, Calendar, MapPin, Award, TrendingUp, Clock, ThumbsUp, User, ClipboardList, HelpCircle, MessageCircle, ArrowLeft, UserCircle, Loader } from 'lucide-react';
const DetailPage = ({ data, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {data.company} - {data.role}
            </h1>
            <div className="flex gap-3">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <ThumbsUp size={18} />
                Helpful
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold uppercase">
              {data.difficulty}
            </span>
            <span className="inline-block bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm">
              {data.experienceLevel}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="text-lg">✓</span> {data.status}
            </span>
          </div>
          
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-gray-500" />
              <span className="font-medium">Location:</span>
              <span className="text-gray-600">{data.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <span className="font-medium">Interview Date:</span>
              <span className="text-gray-600">{data.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCircle size={18} className="text-gray-500" />
              <span className="font-medium">Posted by:</span>
              <span className="text-gray-600">{data.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-500" />
              <span className="font-medium">Posted on:</span>
              <span className="text-gray-600">11/2/2025</span>
            </div>
          </div>
        </div>
        
        {/* Interview Rounds Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
            <ClipboardList size={28} />
            Interview Rounds
          </h2>
          
          <ol className="space-y-3 text-gray-700 list-decimal list-inside">
            {data.rounds.split(', ').map((round, index) => (
              <li key={index} className="text-lg">{round}</li>
            ))}
          </ol>
        </div>
        
        {/* Questions Asked Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
            <HelpCircle size={28} />
            Questions Asked
          </h2>
          
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
  {data.questionsAsked || 'No questions details provided yet.'}
</p>
        </div>
        
        {/* Overall Experience Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
            <MessageCircle size={28} />
            Overall Experience
          </h2>
          
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
  {data.overallExperience || 'No overall experience provided yet.'}
</p>
        </div>
      </div>
    </div>
  );
};

const Interviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [experience, setExperience] = useState('all');
  const [role, setRole] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [experiences, setExperiences] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

 // Fetch data from API when component loads
useEffect(() => {
  const loadInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Fetching interviews...');
      const data = await fetchInterviews();
      console.log('✅ Data loaded:', data.length, 'interviews');
      
      setExperiences(data);
      
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadInterviews();
}, []);
  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficulty === 'all' || exp.difficulty.toLowerCase() === difficulty;
    const matchesExperience = experience === 'all' || exp.experienceLevel === experience;
    const matchesRole = role === 'all' || exp.role.toLowerCase().includes(role.toLowerCase());
    
    return matchesSearch && matchesDifficulty && matchesExperience && matchesRole;
  });

  const sortedExperiences = [...filteredExperiences].sort((a, b) => {
    if (sortBy === 'popular') return b.helpful - a.helpful;
    return 0;
  });

  const getDifficultyColor = (diff) => {
    switch(diff.toLowerCase()) {
      case 'easy': return 'bg-teal-50 text-teal-600';
      case 'medium': return 'bg-yellow-50 text-yellow-600';
      case 'hard': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Show detail page if an experience is selected
  if (selectedExperience) {
    return <DetailPage data={selectedExperience} onBack={() => setSelectedExperience(null)} />;
  }
  // Loading state
if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading interview experiences...</p>
      </div>
    </div>
  );
}

// Error state
if (error && experiences.length === 0) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <p className="text-red-600 text-lg font-semibold mb-2">Error loading data</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-blue-600 mb-2">Interview Experiences</h2>
              <p className="text-gray-600 text-base">Real interview experiences from candidates across top tech companies</p>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors text-sm shadow-sm">
              + Share Your Experience
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Experience Filter */}
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Experience Levels</option>
              <option value="0-2 years">0-2 years</option>
              <option value="1-3 years">1-3 years</option>
              <option value="2-4 years">2-4 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="4-6 years">4-6 years</option>
            </select>

            {/* Role Filter */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Job Roles</option>
              <option value="software">Software Engineer</option>
              <option value="frontend">Frontend Engineer</option>
              <option value="backend">Backend Engineer</option>
              <option value="sde">SDE</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Showing <span className="font-semibold text-gray-800">1-{sortedExperiences.length}</span>
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSortBy('recent')}
                className={`px-4 py-2 rounded-md font-medium transition-colors text-sm flex items-center ${
                  sortBy === 'recent' 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <Clock className="inline w-4 h-4 mr-1" />
                Recent
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-4 py-2 rounded-md font-medium transition-colors text-sm flex items-center ${
                  sortBy === 'popular' 
                    ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <TrendingUp className="inline w-4 h-4 mr-1" />
                Popular
              </button>
            </div>
          </div>
        </div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedExperiences.map((exp) => (
            <div 
              key={exp.id} 
              onClick={() => setSelectedExperience(exp)}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-blue-600 line-clamp-1">{exp.company}</h3>
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${getDifficultyColor(exp.difficulty)}`}>
                    {exp.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-800 font-semibold mb-3 line-clamp-1">{exp.role} • {exp.location}</p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-3">
                <span className="bg-gray-100 px-2.5 py-1 rounded">{exp.experienceLevel}</span>
                <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded font-medium">{exp.status}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-md mb-3 flex-grow">
                <p className="text-xs font-semibold text-gray-700 mb-1">Rounds:</p>
                <p className="text-xs text-gray-600 line-clamp-2">{exp.rounds}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-auto">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate">by {exp.author}</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="flex items-center text-yellow-600">
                    <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                    <span className="font-semibold">{exp.helpful}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2 text-right">{exp.date}</div>
            </div>
          ))}
        </div>

        {sortedExperiences.length === 0 && !loading && (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg">No interview experiences found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold text-indigo-400 mb-4">KodeCompiler</h4>
              <p className="text-gray-400 text-sm">Share and explore real interview experiences from top tech companies.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-indigo-400">Platform</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-indigo-400">Compiler</a></li>
                <li><a href="#" className="hover:text-indigo-400">Arena</a></li>
                <li><a href="#" className="hover:text-indigo-400">Contests</a></li>
                <li><a href="#" className="hover:text-indigo-400">Interviews</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-indigo-400">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-indigo-400">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-400">For Recruiters</a></li>
                <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-indigo-400">Resources</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-indigo-400">Interview Prep</a></li>
                <li><a href="#" className="hover:text-indigo-400">Coding Problems</a></li>
                <li><a href="#" className="hover:text-indigo-400">System Design</a></li>
                <li><a href="#" className="hover:text-indigo-400">Mock Interviews</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 KodeCompiler. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Interviews;