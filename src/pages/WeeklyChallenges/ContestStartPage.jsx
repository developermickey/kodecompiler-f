import React, { useEffect, useState } from 'react';
import { Trophy, Clock, Award, FileText, AlertCircle, CheckCircle, Calendar, Target, Code } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useRef } from "react";


export default function ContestStartPage() {
  const [agreed, setAgreed] = useState(false);
  const [contestData, setContestData] = useState(null);
  const [contestleaderboard, setContestleaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardskip , setleaderboardskip] = useState(0);

  const { id } = useParams(); // ✅ FIX 1
  const user = useSelector((state) => state.auth.user);
  const leaderboardRef = useRef(null);


  useEffect(() => {

    if (!user) {
    window.location.href = `/login`;
    }
    const fetchContestData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/weekly-challenges/${id}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error("Unable to fetch contest data");
        }

        const data = await res.json();

        setContestData({
          _id: data.challenge._id,
          contest_type: data.challenge.contest_type ,
          status: data.challenge.status,
          week_number: data.challenge.week_number || 0,
          year: data.challenge.year,
          title: data.challenge.title,
          description: data.challenge.description,
          start_date: data.challenge.start_date,
          end_date: data.challenge.end_date,
          questions: data.challenge.questions || [],
          my_progress: {
            questions_solved: data.my_progress?.questions_solved || [],
            total_points: data.my_progress?.total_points || 0
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContestData();
    }
  }, [id]); 



   useEffect(() => {

     setLoading(true);

     const fetchContestleaderboard = async () => {
      try {

        console.log("entered");

        const res = await fetch(
          `http://localhost:5000/api/weekly-challenges/${id}/leaderboard?skip=${leaderboardskip}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error("Unable to fetch contest data");
        }

        const data = await res.json();
        setContestleaderboard(data);
        console.log(data);

        
      }
       catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContestleaderboard();

  }, [id,contestData,leaderboardskip]); 


  useEffect(() => {
  leaderboardRef.current?.scrollIntoView({ behavior: "smooth" });
}, [leaderboardskip]);


  // ===== LOADING STATE =====
  if (loading) return <div>Loading contest...</div>;

  // ===== ERROR STATE =====
  if (error) return <div>{error}</div>;

  if (!contestData) return null;

  // ✅ SAFE ACCESS
  const totalPoints = contestData.questions.reduce(
    (sum, q) => sum + (q.points || 0),
    0
  );


  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNext = () => {
  setleaderboardskip((prev) => prev + 10);

  setTimeout(() => {
    leaderboardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 100);
};

const handleBack = () => {
  setleaderboardskip((prev) => prev - 10);

  setTimeout(() => {
    leaderboardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 100);
};


  const rules = [
    {
      title: "1. Contest Eligibility & Participation",
      items: [
        "All registered users with verified email addresses are eligible to participate in the contest.",
        "Each participant must use only one account. Creating or using multiple accounts for the same contest is strictly prohibited and will result in disqualification.",
        "Participants must be at least 13 years of age or meet the minimum age requirement as per their local jurisdiction.",
        "By entering the contest, participants agree to abide by all rules and regulations set forth herein."
      ]
    },
    {
      title: "2. Contest Timeline & Deadlines",
      items: [
        "The contest will run for the duration specified in the contest details.",
        "Participants may begin solving problems at any time after the contest starts, but all submissions must be made before the end time.",
        "Late submissions will not be accepted under any circumstances. System time stamps will be used to verify submission times.",
        "In case of technical difficulties with the platform, the organizing team reserves the right to extend the deadline at their sole discretion.",
        "A countdown timer will be displayed throughout the contest to help participants manage their time effectively."
      ]
    },
    {
      title: "3. Problem Solving & Submissions",
      items: [
        "Each contest consists of multiple coding problems with varying difficulty levels and point values as specified.",
        "Only the most recent submission for each problem will be considered for final evaluation and scoring.",
        "Solutions must be written in one of the supported programming languages available on the platform.",
        "Each solution must pass all hidden test cases to receive full points. Partial points may be awarded if some test cases pass.",
        "Code must compile and execute within the specified time and memory limits. Solutions exceeding these limits will be marked as failed.",
        "Participants should test their code with sample test cases before final submission to ensure correctness."
      ]
    },
    {
      title: "4. Scoring System & Point Allocation",
      items: [
        "Points are awarded based on successful completion of problems. Each problem has a predetermined point value based on its difficulty.",
        "Full points are awarded only when a solution passes all test cases (both sample and hidden).",
        "In contests with time-based scoring, earlier submissions of correct solutions may receive bonus points or higher rankings.",
        "Partial credit may be given for solutions that pass a subset of test cases, calculated proportionally to the number of passed cases.",
        "The total score is the sum of points earned across all problems attempted.",
        "In case of tied scores, the participant with the earlier submission time for their last scored problem will rank higher."
      ]
    },
    {
      title: "5. Code of Conduct & Academic Integrity",
      items: [
        "All submitted code must be original work written by the participant during the contest period.",
        "Plagiarism of any kind is strictly forbidden. This includes copying code from online sources, other participants, AI code generators, or pre-written solutions.",
        "Participants may use standard libraries and built-in functions of their chosen programming language as documented in official documentation.",
        "Collaboration, communication, or sharing of solutions with other participants during the contest is prohibited.",
        "Participants may not share problem statements, test cases, or solutions publicly or privately until the contest has officially ended.",
        "Use of automated tools, bots, or scripts to gain unfair advantage is strictly prohibited."
      ]
    },
    {
      title: "6. Technical Requirements & Platform Usage",
      items: [
        "Participants must have a stable internet connection throughout the contest duration.",
        "The platform is optimized for modern web browsers including Chrome, Firefox, Safari, and Edge (latest versions).",
        "Participants are responsible for their own hardware, software, and internet connectivity. Technical issues on the participant's end will not warrant deadline extensions.",
        "Each test case execution is subject to time limits (typically 1-5 seconds) and memory limits (typically 256-512 MB) as specified per problem.",
        "The platform may experience maintenance or updates during non-contest hours, which will be announced in advance."
      ]
    },
    {
      title: "7. Prohibited Activities & Violations",
      items: [
        "Attempting to access, modify, or view unauthorized content including hidden test cases or other participants' submissions.",
        "Engaging in any activity that disrupts the contest platform, infrastructure, or negatively impacts other participants.",
        "Using distributed denial-of-service (DDoS) attacks, SQL injection, or any other malicious techniques against the platform.",
        "Exploiting bugs, glitches, or vulnerabilities in the system for unfair advantage. Discovered vulnerabilities should be reported immediately.",
        "Creating fake accounts, vote manipulation, or any form of fraudulent activity.",
        "Harassment, hate speech, or inappropriate behavior towards other participants, staff, or in any platform communication channels."
      ]
    },
    {
      title: "8 Intellectual Property & Content Rights",
      items: [
        "All problem statements, test cases, and contest materials remain the intellectual property of the organizing company.",
        "Participants retain ownership of their submitted code solutions.",
        "By submitting solutions, participants grant the platform a non-exclusive license to store, execute, and evaluate their code for contest purposes.",
        "Participants may be featured in promotional materials, blog posts, or social media if they rank in top positions. Participants can opt out by contacting support.",
        "Solutions may be used for educational purposes or platform improvements with participant anonymity maintained unless consent is explicitly given."
      ]
    },
    {
      title: "9. Disputes & Appeals",
      items: [
        "Any concerns or disputes regarding judging, scoring, or rule interpretation must be raised within 24 hours of contest conclusion.",
        "Disputes should be submitted through official channels (support email or dedicated dispute form) with detailed explanations.",
        "The organizing team will review all disputes thoroughly and respond within 5-7 business days.",
        "Decisions made by contest organizers and judges after review are final and binding.",
        "Participants agree to accept the outcome of any dispute resolution process conducted by the organizers."
      ]
    },
    {
      title: "10. Privacy & Data Protection",
      items: [
        "Personal information collected during registration and contest participation will be handled according to the platform's Privacy Policy.",
        "Participant data will not be shared with third parties except as required by law or for prize fulfillment purposes.",
        "Submission code and performance data may be analyzed in aggregate for platform improvements and research.",
        "Participants have the right to request access to their data or request deletion after the contest concludes, subject to legal retention requirements.",
        "Communication from the platform regarding contests will be sent to registered email addresses. Participants can manage email preferences in account settings."
      ]
    },
    {
      title: "11. General Terms & Agreement",
      items: [
        "By clicking 'I Agree' and starting the contest, participants acknowledge they have read, understood, and agree to all rules and regulations.",
        "These rules constitute the entire agreement between participants and organizers regarding the contest.",
        "If any provision of these rules is found to be invalid or unenforceable, the remaining provisions shall remain in full effect.",
        "These rules are governed by the laws of the jurisdiction where the organizing company is registered.",
        "Organizers reserve all rights not expressly granted herein and may update these rules for future contests."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-slate-200">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {contestData.contest_type} Contest {contestData.week_number !== 0 ? `• Week ${contestData.week_number}`:null}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {contestData.title}
              </h1>
             
              <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Start: {formatDate(contestData.start_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>End: {formatDate(contestData.end_date)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 text-center min-w-[100px]">
                <div className="text-xs text-blue-600 font-medium mb-1">Questions</div>
                <div className="text-2xl font-bold text-blue-700">{contestData.questions.length}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 text-center min-w-[100px]">
                <div className="text-xs text-purple-600 font-medium mb-1">Total Points</div>
                <div className="text-2xl font-bold text-purple-700">{totalPoints}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contest Description */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-slate-600" />
            <h2 className="text-base font-semibold text-slate-900">Contest Overview</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
          {contestData.description}
            
          </p>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-slate-600" />
            <h2 className="text-base font-semibold text-slate-900">Problems</h2>
          </div>
          <div className="space-y-3">
            {contestData.questions.map((question, index) => (
             <div
                key={index}
                className={`border rounded-lg p-4 transition-all
                  ${
                    contestData.my_progress?.questions_solved?.includes(question.question_number)
                      ? "bg-green-50 border-green-400"
                      : "border-slate-200 hover:border-blue-300 hover:shadow-sm"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-500">
                        Question {question.question_number}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                      {question.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                      <Target className="w-3.5 h-3.5" />
                      <span>Points</span>
                    </div>
                    <div className="text-xl font-bold text-blue-600">{question.points}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules and Regulations or Leaderboard*/}
        {contestData.status == 'active'?
        <>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-slate-600" />
            <h2 className="text-base font-semibold text-slate-900">Rules & Regulations</h2>
          </div>
          <div className="text-xs text-slate-500 mb-4 bg-amber-50 border border-amber-200 rounded p-3">
            <strong>Important:</strong> Please read all rules carefully before starting the contest. By proceeding, you acknowledge 
            that you have read and agree to abide by all the rules and regulations outlined below.
          </div>
          <div className="space-y-4">
            {rules.map((section, index) => (
              <div key={index} className="border-l-2 border-slate-300 pl-4">
                <h3 className="text-xs font-semibold text-slate-900 mb-2">{section.title}</h3>
                <ul className="space-y-1.5">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-600 leading-relaxed flex gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

     
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="agree" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
              I have read and agree to all the rules and regulations stated above. I understand that violation of any rule 
              may result in disqualification. I confirm that all my submissions will be my original work and I will maintain 
              academic integrity throughout the contest.
            </label>
          </div>
          <button
            disabled={!agreed}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
              agreed
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {agreed ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Start Contest
              </span>
            ) : (
              'Please accept the rules to continue'
            )}
          </button>
          <p className="text-xs text-center text-slate-500 mt-3">
            Make sure you have a stable internet connection before starting
          </p>
        </div>
         </>:<div ref={leaderboardRef}>
  
         <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
  <div className="flex items-center gap-2 mb-4">
    <Trophy className="w-5 h-5 text-amber-500" />
    <h2 className="text-base font-semibold text-slate-900">
      Contest Leaderboard
    </h2>
  </div>

  {/* Header */}
  <div className="grid grid-cols-12 text-xs font-semibold text-slate-500 border-b pb-2 mb-3">
    <div className="col-span-2">Rank</div>
    <div className="col-span-5">User</div>
    <div className="col-span-3 text-center">Solved</div>
    <div className="col-span-2 text-right">Points</div>
  </div>

  {/* Rows */}
  <div className="space-y-2">
    {contestleaderboard?.leaderboard?.map((player) => (
      <div
        key={player.user_id || player.username}
        className="grid grid-cols-12 items-center p-3 rounded-lg border border-slate-200 hover:shadow-sm transition"
      >
        {/* Rank */}
        <div className="col-span-2 font-bold text-slate-800">
          #{player.rank}
        </div>

        {/* Username */}
        <div className="col-span-5 font-medium text-slate-900 truncate">
          {player.username}
        </div>

        {/* Solved */}
        <div className="col-span-3 text-center text-slate-600">
          {player.questions_solved?.length}
        </div>

        {/* Points */}
        <div className="col-span-2 text-right font-bold text-blue-600">
          {player.total_points}
        </div>
      </div>
    ))}
  </div>
  <div className="flex justify-between items-center mt-6">
  {/* Back Button */}
  {leaderboardskip !== 0 ? (
    <button
      onClick={handleBack}
      className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 
                 text-slate-700 bg-white hover:bg-slate-50 
                 transition-all shadow-sm hover:shadow"
    >
      ← Back
    </button>
  ) : (
    <div />
  )}

  {/* Page Info (optional but professional) */}
  <span className="text-xs text-slate-500">
    Showing {leaderboardskip + 1} –{" "}
    {Math.min(leaderboardskip + 10, contestleaderboard.total)}
    {" "}of {contestleaderboard.total}
  </span>

  {/* Next Button */}
  {leaderboardskip+10 < contestleaderboard.total ? (
    <button
      onClick={handleNext}
      className="px-4 py-2 text-sm font-medium rounded-lg 
                 bg-gradient-to-r from-blue-600 to-blue-700 
                 text-white hover:from-blue-700 hover:to-blue-800
                 transition-all shadow-sm hover:shadow"
    >
      Next →
    </button>
  ) : (
    <div />
  )}
</div>

  
  
</div>
  
</div>
         }
      </div>
    </div>
  );
}