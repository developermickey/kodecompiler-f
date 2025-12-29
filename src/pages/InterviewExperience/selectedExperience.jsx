import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchinterviewbyid } from "../../redux/slices/interviewExperienceSlice";

export default function SelectedExperience() {
  const { experienceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [votechange, setvotechange] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const { experience, experienceloading, experienceerror } =
    useSelector((state) => state.experience);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(fetchinterviewbyid(experienceId));
  }, [experienceId, user, dispatch, navigate,votechange]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const markhelp = async()=>{

    try{

        const res = await fetch(`http://localhost:5000/api/interview-experiences/${experienceId}/helpful`, {
            method:"POST",
            credentials:"include"
        })

        if(!res.ok)
        {
            throw new Error("Unable to vote");
        }

       setvotechange(!votechange);
    }
    catch(e)
    {
        console.log(e.message);
    }

  }

  // Get difficulty color classes
  const getDifficultyClass = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-50 border-green-200 text-green-700';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'hard': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (experienceloading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-3 text-gray-600 text-xs">Loading experience details...</p>
      </div>
    </div>
  );

  if (experienceerror) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Error Loading Experience</h3>
        <p className="text-gray-500 text-xs mb-4 max-w-md mx-auto">{experienceerror}</p>
        <button 
          onClick={() => navigate(-1)}
          className=" cursor-pointer px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  if (!experience) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className=" cursor-pointer p-1.5 hover:bg-white/20 rounded-lg transition duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-bold">Interview Experience Details</h1>
                <p className="text-blue-100 text-xs mt-0.5">Viewing complete interview story</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Experience Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Company Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-blue-700 font-bold text-base">
                    {experience.company?.charAt(0) || 'C'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{experience.company}</h2>
                  <p className="text-gray-600 text-sm mt-0.5">{experience.job_role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {experience.offer_received && (
                      <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Offer Received
                      </span>
                    )}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getDifficultyClass(experience.difficulty)}`}>
                      {experience.difficulty} Difficulty
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Posted on</div>
                <div className="text-sm font-medium text-gray-700">{formatDate(experience.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-5">
                {/* Interview Details Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Interview Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      </svg>
                      <div className="min-w-0">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Location</div>
                        <div className="text-xs font-medium truncate">{experience.location || 'Not specified'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Years of Experience</div>
                        <div className="text-xs font-medium">{experience.years_of_experience} years</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Interview Date</div>
                        <div className="text-xs font-medium">{experience.interview_date}</div>
                      </div>
                    </div>
                    
                    {experience.salary && experience.salary !== null && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Salary</div>
                          <div className="text-xs font-medium">
                            {typeof experience.salary === 'number' 
                              ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(experience.salary)
                              : experience.salary}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Posted By</div>
                        <div className="text-xs font-medium">
                          {experience.is_anonymous ? 'Anonymous' : experience.username || 'Anonymous'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interview Rounds Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Interview Rounds ({experience.rounds?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {experience.rounds?.map((round, index) => (
                      <div key={index} className="flex items-center bg-white rounded-lg p-2.5 border border-gray-200">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-xs text-gray-700">{round}</span>
                      </div>
                    )) || <p className="text-xs text-gray-500 italic">No rounds specified</p>}
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">Experience Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{experience.helpful_count || 0}</div>
                      <div className="text-[10px] text-blue-500 uppercase tracking-wider">Helpful Votes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{experience.rounds?.length || 0}</div>
                      <div className="text-[10px] text-blue-500 uppercase tracking-wider">Total Rounds</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Columns (2/3 width) */}
              <div className="lg:col-span-2 space-y-5">
                {/* Questions Asked Card */}
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Questions Asked
                  </h3>
                  <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                    {experience.questions_asked || 'No questions details provided.'}
                  </div>
                </div>

                {/* Overall Experience Card */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Overall Experience
                  </h3>
                  <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                    {experience.overall_experience || 'No overall experience details provided.'}
                  </div>
                </div>

                {/* Tips & Advice Card */}
                {experience.tips && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Tips & Advice
                    </h3>
                    <div className="text-xs text-green-800 leading-relaxed whitespace-pre-line">
                      {experience.tips}
                    </div>
                  </div>
                )}

                {/* LinkedIn Profile */}
                {experience.linkedin_profile && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">LinkedIn Profile</h3>
                    <a 
                      href={experience.linkedin_profile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      View LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-gray-500">
                  
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="cursor-pointer px-4 py-2 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold"
                  >
                    ← Back to List
                  </button>
                  <button onClick={markhelp} className="cursor-pointer flex items-center gap-1 px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                    </svg>
                    Mark Helpful ({experience.helpful_count || 0})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Found this helpful?</h3>
              <p className="text-xs text-gray-600">Consider sharing your own interview experience to help others!</p>
            </div>
            <button
              onClick={() => navigate('/interview-experiences')}
              className="cursor-pointer px-5 py-2.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 shadow-sm hover:shadow whitespace-nowrap"
            >
              Share Your Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}