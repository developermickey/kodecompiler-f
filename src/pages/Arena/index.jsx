import React, { useState, useEffect, useMemo } from 'react';
import { Search, CheckCircle, BarChart3, X, Loader, Building2, Briefcase, ArrowLeft, TrendingUp, Target, Award, Sparkles, Zap, Trophy } from 'lucide-react';
import { useSelector } from "react-redux";
const Arena = () => {

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCompanyMode, setShowCompanyMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [solvedProblemIds , setsolvedProblemIds ] = useState([]);
  
  // Data State
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0, solved: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedata, setFetchedData] = useState([]);
  const [solved, setSolved] = useState([]);
  const user = useSelector((state) => state.auth.user);
 
  // Company Data - Replace with your API
  

  // Fetch Data (Replace with your API calls)
  useEffect(  () => {

   const fetchAllData = async () =>
    {
        try
        {
            
            const response = await fetch("http://localhost:5000/api/problems");
            const data = await response.json();
            setFetchedData(data);
            setProblems(data.problems);

            if(user)
            {
             const solvedResponse = await fetch(
              "http://localhost:5000/api/problems/user-progress",
              {
                method: "GET",
                credentials: "include"
              }
            );
             const solvedData = await solvedResponse.json();
             setSolved(solvedData);
             setsolvedProblemIds(solvedData.problemIds||[]);
            }
           // fetchCategories();
              setLoading(false);
        }
        catch (error)
        {
            console.error("Error fetching data:", error);
        }
    };

    fetchAllData();
    
  
  }, []);

  useEffect(()=>{

           
            setStats({ total: fetchedata.total , easy: fetchedata.easy , medium: fetchedata.medium , hard: fetchedata.hard, solved: solved.solvedCount });
            setCategories([...new Set(problems.map(p => p.category))]);
            
  }, [problems,solved])

  // const fetchProblems = async () => {
  //   try {
  //     setLoading(true);
  //     setProblems(fetchedata.problems);
  //   } catch (error) {
  //     console.error('Error fetching problems:', error);
  //     setLoading(false);
  //   }
  // };

  // const fetchStats = async () => {
  //   try { 
  //   setStats({ total: fetchedata.total , easy: fetchedata.easy , medium: fetchedata.medium , hard: fetchedata.hard, solved: solved.solvedCount });
  //   } catch (error) {
  //     console.error('Error fetching stats:', error);
  //   }
  // };

  // const fetchCategories = async () => {
  //   try {
      
  //     setCategories([...new Set(problems.map(p => p.category))]);
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //   }
  // };

  
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           problem.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [problems, searchQuery, selectedDifficulty, selectedCategory]);

  // Company filtered problems
  const companyFilteredProblems = useMemo(() =>
{
  const query = companySearchQuery.toLowerCase().trim();

  if (!query) return problems;

  return problems.filter(problem =>
    Array.isArray(problem.companies) &&
    problem.companies.some(company =>
      company.toLowerCase().includes(query)
    )
  );
}, [problems, companySearchQuery]);

  // Handler Functions
  const handleSolve = (problemId) => {
    
    if (!user) {
    
    window.location.href = "/login";
    return null;
  }
    window.location.href = `/problem/${problemId}`;
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('all');
    setSelectedCategory('all');
  };

  const handleCompanySearch = (e) => {
    setCompanySearchQuery(e.target.value);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
  };

  const resetCompanyFilters = () => {
    setCompanySearchQuery('');
    setSelectedCompany('all');
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Hard': return 'text-rose-600 bg-rose-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const solvedCompanyProblems = companyFilteredProblems.filter(problem =>
    solvedProblemIds.includes(problem.problem_id)
);

const companySolvedPercentage =
    companyFilteredProblems.length === 0
        ? 0
        : ((solvedCompanyProblems.length / companyFilteredProblems.length) * 100).toFixed(2);


  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  // Company Mode View
  if (showCompanyMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
        {/* Professional Header with Gradient */}
        <div className="bg-gradient-to-r from-[#0652e9] via-indigo-600 to-purple-600 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Back Button */}
            <button
              onClick={() => setShowCompanyMode(false)}
              className="mb-8 flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to All Problems</span>
            </button>

            {/* Main Header Content */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-3xl mb-6 shadow-xl">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                Company Interview Problems
              </h1>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                Your ultimate companion for interview preparation. Master problems from top tech companies and ace your next interview.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{companyFilteredProblems.length}</div>
                    <div className="text-indigo-100 text-sm font-medium">Total Problems</div>
                  </div>
                </div>
              </div>
              
              
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-amber-300" />
        </div>
        <div>
            <div className="text-3xl font-bold text-white">
                {companySolvedPercentage}%
            </div>
            <div className="text-indigo-100 text-sm font-medium">
                Preparation Done
            </div>
        </div>
    </div>
</div>

<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-300" />
        </div>
        <div>
            <div className="text-3xl font-bold text-white">
                {solvedCompanyProblems.length}
            </div>
            <div className="text-indigo-100 text-sm font-medium">
                Problems Solved
            </div>
        </div>
    </div>
</div>
            </div>
          </div>
          
          {/* Wave Separator */}
          <div className="relative h-12">
            <svg className="absolute bottom-0 w-full h-12" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 48h1440V0c-180 48-360 48-540 24S540 0 360 24 0 48 0 48z" fill="rgb(248, 250, 252)"/>
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Featured Companies Banner */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Featured Companies</h2>
                <p className="text-slate-600 text-sm">Search problems asked by leading tech companies</p>
              </div>
              <Building2 className="w-8 h-8 text-[#0652e9]" />
            </div>
            
            {/* Company Tags */}
            <div className="flex flex-wrap gap-3">
              {['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Tesla', 'Uber'].map((company) => (
                <button
                  key={company}
                  onClick={() => setCompanySearchQuery(company)}
                  className="px-5 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-[#0652e9] hover:to-indigo-600 text-slate-700 hover:text-white rounded-xl font-medium transition-all duration-200 border border-slate-200 hover:border-transparent hover:shadow-lg hover:scale-105 transform"
                >
                  {company}
                </button>
              ))}
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-6 border border-slate-100">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search company problems... (e.g., Google, Amazon, Microsoft)"
                  value={companySearchQuery}
                  onChange={handleCompanySearch}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 focus:border-transparent transition-all"
                />
              </div>
            
              {(companySearchQuery || selectedCompany !== 'all') && (
                <button 
                  onClick={resetCompanyFilters}
                  className="px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                  title="Clear filters"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-slate-600">
              Showing <span className="font-semibold text-[#0652e9]">{companyFilteredProblems.length}</span> problems
              {selectedCompany !== 'all' && <span> from <span className="font-semibold text-[#0652e9]">{selectedCompany}</span></span>}
            </div>
            {companySearchQuery && (
              <div className="text-sm text-slate-500">
                Search results for: <span className="font-semibold text-[#0652e9]">"{companySearchQuery}"</span>
              </div>
            )}
          </div>

          {/* Problems List */}
          {companyFilteredProblems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center border border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">No problems found</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">Try searching for a different company or adjusting your search query</p>
              <button 
                onClick={resetCompanyFilters}
                className="px-6 py-3 bg-[#0652e9] text-white rounded-xl hover:bg-[#0547d1] transition-colors shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {companyFilteredProblems.map((problem) => (
                <div key={problem.problem_id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-slate-400 font-medium">#{problem.problem_id}</span>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#0652e9] transition-colors">
                          {problem.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        {problem.solved && (
                          <div className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Solved</span>
                          </div>
                        )}
                      </div>
                      <p className="text-slate-600 mb-3">{problem.description}</p>
                      <div className="flex items-center gap-2">
                        {problem.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-indigo-50 text-[#0652e9] rounded-lg text-sm font-medium">
                            {tag}
                          </span>
                        ))}
                        <span className="ml-4 text-slate-500 text-sm flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          Acceptance: {problem.total_submissions > 0 ? `${Number(((problem.accepted_submissions/problem.total_submissions)*100).toFixed(2))}%` : 'N/A'}
                        </span>
                        {solvedProblemIds.includes(problem.problem_id) && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            ✅ Solved
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSolve(problem.problem_id)}
                      className="w-full sm:w-auto px-6 py-2 bg-[#0652e9] text-white text-lg font-semibold rounded-xl hover:bg-[#0547d1] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0652e9]/30 hover:scale-105 transform"
                    >
                      {solvedProblemIds.includes(problem.problem_id) ? 'Resolve' : 'Solve'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal Mode View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0652e9] via-indigo-600 to-purple-600 rounded-3xl p-8 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Master Your Skills</h2>
              </div>
              <p className="text-indigo-100 text-lg max-w-2xl">
                Challenge yourself with {stats.total} curated problems. Track your progress and become interview-ready!
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-amber-300" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.solved||0}</div>
                    <div className="text-indigo-100 text-sm">Solved</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-emerald-300" />
                  <div>
                    <div className="text-2xl font-bold text-white">{Math.round((stats.solved / stats.total) * 100) || 0}%</div>
                    <div className="text-indigo-100 text-sm">Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200 group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-[#0652e9]" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#0652e9] mb-2">{stats.total}</div>
            <div className="text-slate-600 text-sm font-medium">Total Problems</div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-white mb-2">{stats.easy}</div>
                <div className="text-emerald-50 text-sm font-medium">Easy</div>
              </div>
              <div className="text-5xl text-emerald-100 transition-transform duration-300 group-hover:scale-110">
                🧩
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-white mb-2">{stats.medium}</div>
                <div className="text-amber-50 text-sm font-medium">Medium</div>
              </div>
              <div className="text-5xl text-amber-100 transition-transform duration-300 group-hover:scale-110">
                🛠️
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-white mb-2">{stats.hard}</div>
                <div className="text-rose-50 text-sm font-medium">Hard</div>
              </div>
              <div className="text-5xl text-rose-100 transition-transform duration-300 group-hover:scale-110">
                🧠
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#0652e9] to-indigo-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-white mb-2">{stats.solved||0}</div>
                <div className="text-indigo-50 text-sm font-medium">Solved</div>
              </div>
              <CheckCircle className="w-10 h-10 text-indigo-100 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6 border border-slate-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search problems by title or description..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 focus:border-transparent transition-all"
              />
            </div>
            <select 
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              className="px-6 py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 font-medium text-slate-700"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select 
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-6 py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 font-medium text-slate-700"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCompanyMode(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#0652e9] to-indigo-600 text-white rounded-xl hover:from-[#0547d1] hover:to-indigo-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <Building2 className="w-5 h-5" />
              Companies
            </button>
            {(searchQuery || selectedDifficulty !== 'all' || selectedCategory !== 'all') && (
              <button 
                onClick={resetFilters}
                className="px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                title="Clear filters"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            )}
          </div>
        </div>

        {/* Results Count with Active Filters */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-slate-600">
            Showing <span className="font-semibold text-[#0652e9]">{filteredProblems.length}</span> of {problems.length} problems
          </div>
          {(selectedDifficulty !== 'all' || selectedCategory !== 'all') && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Active filters:</span>
              {selectedDifficulty !== 'all' && (
                <span className="px-3 py-1 bg-indigo-50 text-[#0652e9] rounded-lg text-sm font-medium">
                  {selectedDifficulty}
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 bg-indigo-50 text-[#0652e9] rounded-lg text-sm font-medium">
                  {selectedCategory}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Problems List */}
        {filteredProblems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center border border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">No problems found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">Try adjusting your search or filters to discover more problems</p>
            <button 
              onClick={resetFilters}
              className="px-6 py-3 bg-[#0652e9] text-white rounded-xl hover:bg-[#0547d1] transition-colors shadow-lg hover:shadow-xl"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProblems.map((problem) => (
              <div key={problem.problem_id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200 hover:border-[#0652e9]/30 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-slate-400 font-medium">#{problem.problem_id}</span>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#0652e9] transition-colors">
                        {problem.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      {problem.solved && (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Solved</span>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-600 mb-3">{problem.description}</p>
                    <div className="flex items-center gap-2">
                      {problem.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-indigo-50 text-[#0652e9] rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                          {tag}
                        </span>
                      ))}
                      <span className="ml-4 text-slate-500 text-sm flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        Acceptance: {problem.total_submissions > 0 ? `${ Number(((problem.accepted_submissions/problem.total_submissions)*100).toFixed(2))}%` : 'N/A'}
                      </span>

                      {solvedProblemIds.includes(problem.problem_id)?<span className="flex items-center gap-1 text-emerald-600">
  ✅ Solved
</span>:""}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleSolve(problem.problem_id)}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#0652e9] to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-[#0547d1] hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0652e9]/30 hover:scale-105 transform"
                  >
                   {solvedProblemIds.includes(problem.problem_id) ? 'Resolve' : 'Solve'}

                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Arena;