import React, { useReducer, useEffect, useState } from "react";
import {
  Code2,
  Cloud,
  PenTool,
  ArrowRight,
  X,
  Upload,
  Linkedin,
  Briefcase,
  MapPin,
  Clock,
  ChevronLeft,
  Check,
  Command,
  Sparkles,
} from "lucide-react";

// --- JOBS DATA ---
const JOBS = [
  {
    id: "full-stack", // <--- Changed from 'fs-dev' to what you wanted
    title: "Full Stack Developer",
    role: "Senior Engineer",
    department: "Product",
    type: "Full-time",
    location: "Remote",
    salary: "$140k - $180k",
    icon: Code2,
    gradient: "from-blue-500 to-cyan-500",
    description:
      "Build the core engine. React, Node, and heavy system architecture.",
  },
  {
    id: "devops", // <--- This was already good
    title: "DevOps Lead",
    role: "Infrastructure",
    department: "Platform",
    type: "Full-time",
    location: "Remote",
    salary: "$150k - $190k",
    icon: Cloud,
    gradient: "from-violet-500 to-fuchsia-500",
    description:
      "Scale our Kubernetes clusters and own the 99.99% reliability SLO.",
  },
  {
    id: "content", // <--- This was already good
    title: "Content Engineer",
    role: "DSA Specialist",
    department: "Education",
    type: "Contract",
    location: "Anywhere",
    salary: "$80 - $120 / hr",
    icon: PenTool,
    gradient: "from-orange-500 to-amber-500",
    description:
      "Create the world’s hardest coding problems. Stump the experts.",
  },
];
// --- REDUCER & STATE ---
const initialState = {
  isOpen: false,
  step: 1, // 1: Contact, 2: Links, 3: Review
  job: null,
  status: "idle",
  formData: {
    name: "",
    email: "",
    phone: "",
    resume: "",
    linkedin: "",
    experience: "",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return { ...initialState, isOpen: true, job: action.payload };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "NEXT_STEP":
      return { ...state, step: state.step + 1 };
    case "PREV_STEP":
      return { ...state, step: Math.max(1, state.step - 1) };
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    case "SUBMIT":
      return { ...state, status: "submitting" };
    case "SUCCESS":
      return { ...state, status: "success" };
    default:
      return state;
  }
}

// --- COMPONENTS ---

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
  autoFocus,
}) => (
  <div className="group relative transition-all duration-300">
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-blue-500 transition-colors">
      {label}
    </label>
    <div className="relative flex items-center">
      <input
        autoFocus={autoFocus}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50/50 border-b-2 border-slate-200 text-lg font-medium text-slate-800 py-3 pl-3 pr-10 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-300"
      />
      {Icon && (
        <Icon className="absolute right-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      )}
    </div>
  </div>
);

// --- MAIN PAGE ---
const CareersPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Keyboard trap for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!state.isOpen) return;
      if (e.key === "Escape") dispatch({ type: "CLOSE" });
      if (e.key === "Enter" && e.metaKey) handleNext(); // Cmd+Enter shortcut
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen, state.step]);

  const handleNext = () => {
    if (state.step < 3) dispatch({ type: "NEXT_STEP" });
    else handleSubmit();
  };

  const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  const handleSubmit = async () => {
    dispatch({ type: "SUBMIT" });

    const payload = {
      // This value now comes from the JOBS id above ('full-stack', 'devops', etc)
      job_id: state.job.id,

      // Ensure these keys match your Google Sheet Headers (lowercase)
      name: state.formData.name,
      email: state.formData.email,
      phone: state.formData.phone,
      resume: state.formData.resume,
      linkedin: state.formData.linkedin,
      experience: state.formData.experience,
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      });
      dispatch({ type: "SUCCESS" });
    } catch (error) {
      console.error("Error", error);
      dispatch({ type: "CLOSE" });
    }
  };
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-black selection:text-white">
      {/* --- HERO --- */}
      <div className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-xl shadow-slate-900/20">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            We are hiring
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
            Join the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
              Revolution.
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            We don't do "good enough". We are looking for the obsessive ones.
            The ones who dream in code.
          </p>
        </div>

        {/* --- CARDS --- */}
        <div className="grid lg:grid-cols-3 gap-6">
          {JOBS.map((job) => (
            <div
              key={job.id}
              onClick={() => dispatch({ type: "OPEN", payload: job })}
              className="group relative h-[420px] bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2 hover:border-slate-200"
            >
              <div
                className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br ${job.gradient} opacity-[0.03] rounded-full blur-3xl -mr-20 -mt-20 group-hover:opacity-[0.08] transition-opacity`}
              />

              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                    <job.icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {job.location}
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
                  {job.title}
                </h3>
                <p className="text-sm font-medium text-slate-400 mb-6">
                  {job.role} • {job.department}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-6 group-hover:border-slate-100 transition-colors">
                <span className="text-sm font-bold text-slate-400 font-mono">
                  {job.salary}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MULTI-STEP WIZARD MODAL --- */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => dispatch({ type: "CLOSE" })}
          />

          {/* Card */}
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] animate-in fade-in zoom-in-95 duration-300">
            {/* LEFT: INFO PANEL */}
            <div className="hidden md:flex w-1/3 bg-slate-50 border-r border-slate-100 flex-col p-8 justify-between relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${state.job.gradient}`}
              />

              <div>
                <button
                  onClick={() => dispatch({ type: "CLOSE" })}
                  className="mb-8 p-2 -ml-2 hover:bg-slate-200 rounded-full w-fit transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

                <div className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {state.job.department}
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 leading-none">
                  {state.job.title}
                </h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600">
                    {state.job.type}
                  </span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600">
                    {state.job.location}
                  </span>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed">
                  You are applying to be a part of our core team. We review
                  applications manually. Please ensure your portfolio link is
                  accessible.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                        state.step === s
                          ? "bg-slate-900 text-white scale-110"
                          : state.step > s
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {state.step > s ? <Check className="w-4 h-4" /> : s}
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors ${state.step === s ? "text-slate-900" : "text-slate-400"}`}
                    >
                      {s === 1
                        ? "Personal Info"
                        : s === 2
                          ? "Professional"
                          : "Review"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: INTERACTIVE FORM */}
            <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-between">
              {/* Header (Mobile Only) */}
              <div className="md:hidden flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-900">{state.job.title}</h3>
                <button onClick={() => dispatch({ type: "CLOSE" })}>
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* FORM STEPS */}
              <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full transition-all duration-500">
                {state.status === "success" ? (
                  <div className="text-center animate-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                      Application Sent.
                    </h3>
                    <p className="text-slate-500 mb-8">
                      We'll be in touch with you shortly.
                    </p>
                    <button
                      onClick={() => dispatch({ type: "CLOSE" })}
                      className="text-slate-900 font-bold hover:underline"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Step 1: Contact */}
                    {state.step === 1 && (
                      <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            Who are we talking to?
                          </h3>
                          <p className="text-slate-400 text-sm">
                            Let's start with the basics.
                          </p>
                        </div>
                        <InputField
                          autoFocus
                          label="Full Name"
                          value={state.formData.name}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_FIELD",
                              field: "name",
                              value: e.target.value,
                            })
                          }
                          placeholder="Jane Doe"
                        />
                        <InputField
                          label="Email Address"
                          type="email"
                          value={state.formData.email}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_FIELD",
                              field: "email",
                              value: e.target.value,
                            })
                          }
                          placeholder="jane@example.com"
                        />
                        <InputField
                          label="Phone"
                          type="tel"
                          value={state.formData.phone}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_FIELD",
                              field: "phone",
                              value: e.target.value,
                            })
                          }
                          placeholder="+1 555 000 0000"
                        />
                      </div>
                    )}

                    {/* Step 2: Details */}
                    {state.step === 2 && (
                      <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            Show us your work.
                          </h3>
                          <p className="text-slate-400 text-sm">
                            Impress us with your links.
                          </p>
                        </div>
                        <InputField
                          autoFocus
                          label="Resume / Portfolio Link"
                          value={state.formData.resume}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_FIELD",
                              field: "resume",
                              value: e.target.value,
                            })
                          }
                          placeholder="https://read.cv/jane"
                          icon={Upload}
                        />
                        <InputField
                          label="LinkedIn URL"
                          value={state.formData.linkedin}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_FIELD",
                              field: "linkedin",
                              value: e.target.value,
                            })
                          }
                          placeholder="https://linkedin.com/in/jane"
                          icon={Linkedin}
                        />

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                            Years of Experience
                          </label>
                          <select
                            className="w-full bg-slate-50/50 border-b-2 border-slate-200 text-lg font-medium text-slate-800 py-3 pl-3 pr-10 focus:outline-none focus:border-blue-600 transition-all appearance-none"
                            value={state.formData.experience}
                            onChange={(e) =>
                              dispatch({
                                type: "UPDATE_FIELD",
                                field: "experience",
                                value: e.target.value,
                              })
                            }
                          >
                            <option value="">Select range...</option>
                            <option value="0-2">0 - 2 Years</option>
                            <option value="3-5">3 - 5 Years</option>
                            <option value="5+">5+ Years</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Review */}
                    {state.step === 3 && (
                      <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                        <div className="mb-4">
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            Ready to launch?
                          </h3>
                          <p className="text-slate-400 text-sm">
                            Review your details before submitting.
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-100">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                                Name
                              </div>
                              <div className="font-medium text-slate-900">
                                {state.formData.name || "Not provided"}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                                Email
                              </div>
                              <div className="font-medium text-slate-900">
                                {state.formData.email || "Not provided"}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                                Resume
                              </div>
                              <div className="font-medium text-blue-600 truncate">
                                {state.formData.resume || "Not provided"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-blue-50/50 text-blue-700 rounded-lg text-sm">
                          <Sparkles className="w-4 h-4" />
                          You're applying for{" "}
                          <span className="font-bold">{state.job.title}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* NAVIGATION FOOTER */}
              {state.status !== "success" && (
                <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-auto">
                  {state.step > 1 ? (
                    <button
                      onClick={() => dispatch({ type: "PREV_STEP" })}
                      className="flex items-center text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                  ) : (
                    <div /> /* Spacer */
                  )}

                  <button
                    onClick={handleNext}
                    disabled={state.status === "submitting"}
                    className={`
                      flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                      ${
                        state.status === "submitting"
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-slate-900 text-white hover:bg-black hover:scale-105 shadow-lg shadow-slate-900/20"
                      }
                    `}
                  >
                    {state.status === "submitting"
                      ? "Sending..."
                      : state.step === 3
                        ? "Submit Application"
                        : "Continue"}
                    {state.status !== "submitting" && (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
