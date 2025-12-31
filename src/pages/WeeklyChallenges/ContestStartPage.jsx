import React, { useEffect, useState } from "react";
import {
  Trophy,
  Clock,
  Award,
  FileText,
  Loader,
  AlertCircle,
  CheckCircle,
  Calendar,
  Target,
  Code,
  ChevronRight,
  Users,
  BarChart3,
  Shield,
  Flag,
  ChevronDown,
  Check,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef } from "react";
import NotFound from "../NotFound";

export default function ContestStartPage() {
  const [agreed, setAgreed] = useState(false);
  const [contestData, setContestData] = useState(null);
  const [contestleaderboard, setContestleaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardskip, setleaderboardskip] = useState(0);
  const [expandedRules, setExpandedRules] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const leaderboardRef = useRef(null);

  useEffect(() => {
    if (!user) {
      window.location.href = `/login`;
    }
    console.log(user);
    const fetchContestData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/weekly-challenges/${id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Unable to fetch contest data");
        const data = await res.json();
        setContestData({
          _id: data.challenge._id,
          contest_type: data.challenge.contest_type,
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
            total_points: data.my_progress?.total_points || 0,
          },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchContestData();
  }, [id]);

  useEffect(() => {
    const fetchContestleaderboard = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/weekly-challenges/${id}/leaderboard?skip=${leaderboardskip}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Unable to fetch contest data");
        const data = await res.json();
        setContestleaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContestleaderboard();
  }, [id, contestData, leaderboardskip]);

  useEffect(() => {
    leaderboardRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [leaderboardskip]);

  const toggleRule = (index) => {
    setExpandedRules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Loading contest...
          </p>
        </div>
      </div>
    );
  }

  if (!contestData) return <NotFound />;

  const totalPoints = contestData.questions.reduce(
    (sum, q) => sum + (q.points || 0),
    0
  );

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "text-green-600 bg-green-50 border-green-200",
      medium: "text-amber-600 bg-amber-50 border-amber-200",
      hard: "text-red-600 bg-red-50 border-red-200",
    };
    return (
      colors[difficulty.toLowerCase()] ||
      "text-gray-600 bg-gray-50 border-gray-200"
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNext = () => {
    setleaderboardskip((prev) => prev + 10);
    setTimeout(() => {
      leaderboardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleBack = () => {
    setleaderboardskip((prev) => Math.max(0, prev - 10));
    setTimeout(() => {
      leaderboardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
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
        "By entering the contest, participants agree to abide by all rules and regulations set forth herein.",
      ],
    },
    {
      title: "2. Contest Timeline & Deadlines",
      items: [
        "The contest will run for the duration specified in the contest details.",
        "Participants may begin solving problems at any time after the contest starts, but all submissions must be made before the end time.",
        "Late submissions will not be accepted under any circumstances. System time stamps will be used to verify submission times.",
        "In case of technical difficulties with the platform, the organizing team reserves the right to extend the deadline at their sole discretion.",
        "A countdown timer will be displayed throughout the contest to help participants manage their time effectively.",
      ],
    },
    {
      title: "3. Problem Solving & Submissions",
      items: [
        "Each contest consists of multiple coding problems with varying difficulty levels and point values as specified.",
        "Only the most recent submission for each problem will be considered for final evaluation and scoring.",
        "Solutions must be written in one of the supported programming languages available on the platform.",
        "Each solution must pass all hidden test cases to receive full points. Partial points may be awarded if some test cases pass.",
        "Code must compile and execute within the specified time and memory limits. Solutions exceeding these limits will be marked as failed.",
        "Participants should test their code with sample test cases before final submission to ensure correctness.",
      ],
    },
    {
      title: "4. Scoring System & Point Allocation",
      items: [
        "Points are awarded based on successful completion of problems. Each problem has a predetermined point value based on its difficulty.",
        "Full points are awarded only when a solution passes all test cases (both sample and hidden).",
        "In contests with time-based scoring, earlier submissions of correct solutions may receive bonus points or higher rankings.",
        "Partial credit may be given for solutions that pass a subset of test cases, calculated proportionally to the number of passed cases.",
        "The total score is the sum of points earned across all problems attempted.",
        "In case of tied scores, the participant with the earlier submission time for their last scored problem will rank higher.",
      ],
    },
    {
      title: "5. Code of Conduct & Academic Integrity",
      items: [
        "All submitted code must be original work written by the participant during the contest period.",
        "Plagiarism of any kind is strictly forbidden. This includes copying code from online sources, other participants, AI code generators, or pre-written solutions.",
        "Participants may use standard libraries and built-in functions of their chosen programming language as documented in official documentation.",
        "Collaboration, communication, or sharing of solutions with other participants during the contest is prohibited.",
        "Participants may not share problem statements, test cases, or solutions publicly or privately until the contest has officially ended.",
        "Use of automated tools, bots, or scripts to gain unfair advantage is strictly prohibited.",
      ],
    },
    {
      title: "6. Technical Requirements & Platform Usage",
      items: [
        "Participants must have a stable internet connection throughout the contest duration.",
        "The platform is optimized for modern web browsers including Chrome, Firefox, Safari, and Edge (latest versions).",
        "Participants are responsible for their own hardware, software, and internet connectivity. Technical issues on the participant's end will not warrant deadline extensions.",
        "Each test case execution is subject to time limits (typically 1-5 seconds) and memory limits (typically 256-512 MB) as specified per problem.",
        "The platform may experience maintenance or updates during non-contest hours, which will be announced in advance.",
      ],
    },
    {
      title: "7. Prohibited Activities & Violations",
      items: [
        "Attempting to access, modify, or view unauthorized content including hidden test cases or other participants' submissions.",
        "Engaging in any activity that disrupts the contest platform, infrastructure, or negatively impacts other participants.",
        "Using distributed denial-of-service (DDoS) attacks, SQL injection, or any other malicious techniques against the platform.",
        "Exploiting bugs, glitches, or vulnerabilities in the system for unfair advantage. Discovered vulnerabilities should be reported immediately.",
        "Creating fake accounts, vote manipulation, or any form of fraudulent activity.",
        "Harassment, hate speech, or inappropriate behavior towards other participants, staff, or in any platform communication channels.",
      ],
    },
    {
      title: "8 Intellectual Property & Content Rights",
      items: [
        "All problem statements, test cases, and contest materials remain the intellectual property of the organizing company.",
        "Participants retain ownership of their submitted code solutions.",
        "By submitting solutions, participants grant the platform a non-exclusive license to store, execute, and evaluate their code for contest purposes.",
        "Participants may be featured in promotional materials, blog posts, or social media if they rank in top positions. Participants can opt out by contacting support.",
        "Solutions may be used for educational purposes or platform improvements with participant anonymity maintained unless consent is explicitly given.",
      ],
    },
    {
      title: "9. Disputes & Appeals",
      items: [
        "Any concerns or disputes regarding judging, scoring, or rule interpretation must be raised within 24 hours of contest conclusion.",
        "Disputes should be submitted through official channels (support email or dedicated dispute form) with detailed explanations.",
        "The organizing team will review all disputes thoroughly and respond within 5-7 business days.",
        "Decisions made by contest organizers and judges after review are final and binding.",
        "Participants agree to accept the outcome of any dispute resolution process conducted by the organizers.",
      ],
    },
    {
      title: "10. Privacy & Data Protection",
      items: [
        "Personal information collected during registration and contest participation will be handled according to the platform's Privacy Policy.",
        "Participant data will not be shared with third parties except as required by law or for prize fulfillment purposes.",
        "Submission code and performance data may be analyzed in aggregate for platform improvements and research.",
        "Participants have the right to request access to their data or request deletion after the contest concludes, subject to legal retention requirements.",
        "Communication from the platform regarding contests will be sent to registered email addresses. Participants can manage email preferences in account settings.",
      ],
    },
    {
      title: "11. General Terms & Agreement",
      items: [
        "By clicking 'I Agree' and starting the contest, participants acknowledge they have read, understood, and agree to all rules and regulations.",
        "These rules constitute the entire agreement between participants and organizers regarding the contest.",
        "If any provision of these rules is found to be invalid or unenforceable, the remaining provisions shall remain in full effect.",
        "These rules are governed by the laws of the jurisdiction where the organizing company is registered.",
        "Organizers reserve all rights not expressly granted herein and may update these rules for future contests.",
      ],
    },
  ];

  const handleStart = () => {
    if (agreed) {
      console.log("NAVIGATING TO:", `/challenge/${contestData?._id}/start`);

      navigate(`/challenge/${contestData._id}/start`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <Trophy className="w-3.5 h-3.5 text-blue-600" />
            <span>{contestData.contest_type} Contest</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-700 font-medium">
              Week {contestData.week_number || "Special"}
            </span>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-4">
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                  {contestData.title}
                </h1>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-3xl">
                  {contestData.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>
                      Start:{" "}
                      <span className="font-medium">
                        {formatDate(contestData.start_date)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>
                      End:{" "}
                      <span className="font-medium">
                        {formatDate(contestData.end_date)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-24">
                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                    <Code className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs text-gray-600 font-medium">
                      Problems
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {contestData.questions.length}
                  </div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-24">
                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs text-gray-600 font-medium">
                      Points
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {totalPoints}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-900">
              Your Progress
            </h2>
            <span className="text-xs text-gray-500">
              {contestData.my_progress?.questions_solved?.length || 0} of{" "}
              {contestData.questions.length} solved
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${
                  ((contestData.my_progress?.questions_solved?.length || 0) /
                    contestData.questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Problems Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-blue-50 rounded">
              <Code className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Problems</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {contestData.questions.map((question, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-lg border transition-all duration-200 hover:border-gray-300 hover:shadow-sm
                  ${
                    contestData.my_progress?.questions_solved?.includes(
                      question.question_number
                    )
                      ? "border-green-200 bg-green-50/30"
                      : "border-gray-200"
                  }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium text-gray-500">
                          #{question.question_number}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded border font-medium ${getDifficultyColor(
                            question.difficulty
                          )}`}
                        >
                          {question.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {question.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 pl-2">
                      <Target className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-sm font-bold text-gray-900">
                        {question.points}
                      </span>
                    </div>
                  </div>

                  {contestData.my_progress?.questions_solved?.includes(
                    question.question_number
                  ) && (
                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                      <Check className="w-3 h-3" />
                      <span>Solved</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conditional Render: Rules or Leaderboard */}
        {contestData.status === "active" ? (
          <>
            {/* Rules Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-amber-50 rounded">
                  <Shield className="w-4 h-4 text-amber-600" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">
                  Contest Rules
                </h2>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
                <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-100 rounded">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong className="font-semibold">Important:</strong> Please
                    read all rules carefully before starting. By proceeding, you
                    agree to abide by all rules and regulations.
                  </p>
                </div>

                <div className="space-y-2">
                  {rules.map((section, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleRule(index)}
                        className="w-full p-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-700">
                              {index + 1}
                            </span>
                          </div>
                          <h3 className="text-xs font-semibold text-gray-900">
                            {section.title}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                            expandedRules[index] ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {expandedRules[index] && (
                        <div className="p-3 border-t border-gray-100 bg-gray-50">
                          <ul className="space-y-1.5">
                            {section.items.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex gap-2 text-xs text-gray-700 leading-relaxed"
                              >
                                <span className="text-blue-600 font-bold mt-0.5">
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Agreement Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex items-start h-5">
                    <input
                      type="checkbox"
                      id="agree"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                  </div>
                  <label
                    htmlFor="agree"
                    className="text-xs text-gray-700 leading-relaxed cursor-pointer"
                  >
                    I have read and agree to all the rules and regulations
                    stated above. I understand that violation of any rule may
                    result in disqualification. I confirm that all my
                    submissions will be my original work and I will maintain
                    academic integrity throughout the contest.
                  </label>
                </div>

                <button
                  onClick={handleStart}
                  disabled={!agreed}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all
                    ${
                      agreed
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {agreed ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Start Contest
                    </span>
                  ) : (
                    "Accept Rules to Continue"
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  Ensure you have a stable internet connection before starting
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Leaderboard Section */
          <div ref={leaderboardRef} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-50 rounded">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Leaderboard
              </h2>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 p-4 border-b border-gray-200 bg-gray-50">
                <div className="col-span-2 text-xs font-semibold text-gray-600">
                  Rank
                </div>
                <div className="col-span-6 text-xs font-semibold text-gray-600">
                  User
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 text-center">
                  Solved
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 text-right">
                  Points
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-100">
                {contestleaderboard?.leaderboard?.map((player, index) => (
                  <div
                    key={player.user_id || player.username}
                    className={`grid grid-cols-12 gap-3 items-center p-4 hover:bg-gray-50/50 transition-colors
                    ${
                      user && user._id === player?.user_id ? "bg-green-200" : ""
                    }
                  `}
                  >
                    <div className="col-span-2">
                      <div
                        className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold
                        ${
                          player.rank <= 3
                            ? player.rank === 1
                              ? "bg-amber-100 text-amber-800"
                              : player.rank === 2
                              ? "bg-gray-100 text-gray-800"
                              : "bg-amber-50 text-amber-700"
                            : "text-gray-700"
                        }`}
                      >
                        {player.rank}
                      </div>
                    </div>

                    <div className="col-span-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-blue-700">
                            {player.username?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 truncate font-medium">
                          {player.username}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-sm text-gray-900 font-medium">
                          {player.questions_solved?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {player.total_points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    disabled={leaderboardskip === 0}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1.5
                      ${
                        leaderboardskip === 0
                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    Previous
                  </button>

                  <div className="text-xs text-gray-600">
                    <span className="font-medium text-gray-900">
                      {leaderboardskip + 1}
                    </span>{" "}
                    -
                    <span className="font-medium text-gray-900">
                      {" "}
                      {Math.min(
                        leaderboardskip + 10,
                        contestleaderboard?.total || 0
                      )}
                    </span>{" "}
                    of
                    <span className="font-medium text-gray-900">
                      {" "}
                      {contestleaderboard?.total || 0}
                    </span>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={
                      leaderboardskip + 10 >= (contestleaderboard?.total || 0)
                    }
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1.5
                      ${
                        leaderboardskip + 10 >= (contestleaderboard?.total || 0)
                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                          : "text-white bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
