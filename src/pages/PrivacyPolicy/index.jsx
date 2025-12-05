import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <header className="bg-[#0652e9] shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl sm:text-2xl opacity-95">Last updated: December 6, 2025</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <section className="mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 border-b-4 border-[#0652e9] pb-4">
            Introduction
          </h2>
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
            <p className="mb-6 text-lg">
              At KodeCompiler, we prioritize your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our 
              website, use our online coding platform, or interact with our services.
            </p>
            <p className="text-lg">
              By using KodeCompiler (<a href="https://www.kodecompiler.com" className="text-indigo-600 hover:text-indigo-800 font-semibold">kodecompiler.com</a>), you consent to the practices described in this policy.
            </p>
          </div>
        </section>

        <section className="mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8 border-b-4 border-[#0652e9] pb-4">
            Information We Collect
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border-l-4 border-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Code & Execution</h3>
              <ul className="space-y-3 text-slate-700">
                <li>• Source code submitted</li>
                <li>• Input data for execution</li>
                <li>• Language selections</li>
                <li className="font-semibold text-green-700">• Deleted after execution</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-2xl border-l-4 border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Account Info</h3>
              <ul className="space-y-3 text-slate-700">
                <li>• Email & username</li>
                <li>• Saved code snippets</li>
                <li>• Profile preferences</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-2xl border-l-4 border-orange-500 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Usage Data</h3>
              <ul className="space-y-3 text-slate-700">
                <li>• IP address & device</li>
                <li>• Pages visited</li>
                <li>• Compilation stats</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-l-4 border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Contact Info</h3>
              <ul className="space-y-3 text-slate-700">
                <li>• Name & email</li>
                <li>• Support messages</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8 border-b-4 border-[#0652e9] pb-4">
            How We Use Your Information
          </h2>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-8 lg:p-12 rounded-3xl border-l-8 border-green-500 shadow-xl">
            <ul className="grid md:grid-cols-2 gap-4 text-lg text-slate-700">
              <li className="flex items-start mb-4">
                <span className="text-green-500 text-2xl mr-3 flex-shrink-0 mt-1">✓</span>
                <span>Provide online compiler platform</span>
              </li>
              <li className="flex items-start mb-4">
                <span className="text-green-500 text-2xl mr-3 flex-shrink-0 mt-1">✓</span>
                <span>Secure code execution in Docker</span>
              </li>
              <li className="flex items-start mb-4">
                <span className="text-green-500 text-2xl mr-3 flex-shrink-0 mt-1">✓</span>
                <span>Platform improvements & analytics</span>
              </li>
              <li className="flex items-start mb-4">
                <span className="text-green-500 text-2xl mr-3 flex-shrink-0 mt-1">✓</span>
                <span>Customer support & security</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8 border-b-4 border-[#0652e9] pb-4">
            🔒 Code Security Guarantee
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border-4 border-green-200 shadow-2xl">
              <div className="text-5xl mb-6">🔒</div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">Private by Design</h3>
              <p className="text-lg text-green-800 leading-relaxed">
                Your code is <strong>never stored, shared, or analyzed</strong> beyond execution. Temporary processing only.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl border-4 border-blue-200 shadow-2xl">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Secure Execution</h3>
              <ul className="space-y-3 text-lg text-blue-800">
                <li>• Isolated Docker containers</li>
                <li>• HTTPS encrypted transmission</li>
                <li>• Auto-cleanup after execution</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8 border-b-4 border-[#0652e9] pb-4">
            Your Rights & Data Retention
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl border-l-8 border-purple-400">
              <h3 className="text-2xl font-bold text-purple-900 mb-6">Your Privacy Rights</h3>
              <ul className="space-y-3 text-lg text-purple-800">
                <li>• Access your data</li>
                <li>• Request corrections</li>
                <li>• Delete account</li>
                <li>• Opt-out communications</li>
              </ul>
              <p className="mt-6">
                <a href="mailto:privacy@kodecompiler.com" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 inline-block">
                  Contact Privacy Team
                </a>
              </p>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-8 rounded-3xl border-l-8 border-gray-400">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Data Retention</h3>
              <ul className="space-y-3 text-lg text-slate-700">
                <li className="font-semibold text-red-600">• Source Code: Never stored</li>
                <li>• Analytics: 12 months</li>
                <li>• Account: Until deletion</li>
                <li>• Logs: 30 days</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center bg-gradient-to-r from-slate-100 to-slate-200 p-12 lg:p-16 rounded-3xl shadow-2xl mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Need Help?</h2>
          <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            Questions about privacy? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="mailto:privacy@kodecompiler.com"
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              privacy@kodecompiler.com
            </a>
            <a 
              href="mailto:support@kodecompiler.com"
              className="bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              support@kodecompiler.com
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
