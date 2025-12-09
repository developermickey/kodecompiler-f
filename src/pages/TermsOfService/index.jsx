import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-blue-100">Last updated: December 9, 2025</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to KodeCompiler. These Terms of Service govern your access to and use of our online coding platform, website, and related services. By accessing or using KodeCompiler, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these Terms at any time. When we make changes, we will update the "Last updated" date at the top of this page. Your continued use of our services after any changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description of Service</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            KodeCompiler is an online coding platform that allows users to write, compile, and execute code in multiple programming languages. Our service provides a web-based development environment with real-time code execution, syntax highlighting, and other programming tools.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We strive to maintain high availability and performance, but we do not guarantee that our services will be uninterrupted, error-free, or completely secure. We may modify, suspend, or discontinue any aspect of our services at any time without prior notice.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To access certain features of KodeCompiler, you may need to create an account. When creating an account, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            You must be at least 13 years old to create an account. If you are under 18, you represent that you have your parent's or guardian's permission to use our services. You agree to notify us immediately of any unauthorized access to or use of your account.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to suspend or terminate your account at any time if we believe you have violated these Terms or if we determine that your use of our services poses a risk to us, other users, or third parties.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable Use Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You agree to use KodeCompiler only for lawful purposes and in accordance with these Terms. You are prohibited from using our services to compile, execute, or distribute code that is malicious, harmful, or illegal. This includes but is not limited to malware, viruses, ransomware, exploit code, or any code designed to harm, disrupt, or gain unauthorized access to computer systems.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            You may not use our services to violate any applicable laws or regulations, infringe upon the intellectual property rights of others, harass or harm other users, attempt to gain unauthorized access to our systems or networks, or interfere with the proper functioning of our services.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            You may not use our services to mine cryptocurrencies, perform distributed denial-of-service attacks, send spam or unsolicited communications, or engage in any activity that places an unreasonable burden on our infrastructure.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to monitor usage patterns and code execution to ensure compliance with this Acceptable Use Policy. Any violation may result in immediate termination of your account and potential legal action.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            All content, features, and functionality of KodeCompiler, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, data compilations, software, and the compilation thereof, are the exclusive property of KodeCompiler or its licensors and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            You retain all rights to the code you create and submit through our platform. By using our services, you grant us a limited, non-exclusive, royalty-free license to host, store, and process your code solely for the purpose of providing our services to you. We do not claim ownership of your code, and we do not use your code for any purpose other than executing it as requested by you.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You may not copy, modify, distribute, sell, or lease any part of our services or included software, nor may you reverse engineer or attempt to extract the source code of our platform, unless laws prohibit these restrictions or you have our written permission.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Security</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our services, you consent to our collection and use of information as described in our Privacy Policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            While we implement reasonable security measures to protect your data, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security of your information. You acknowledge and accept the inherent security risks of using internet-based services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Execution and Resource Limits</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our platform executes your code in isolated Docker containers with specific resource limitations. We impose limits on execution time, memory usage, CPU usage, and network access to ensure fair usage and platform stability for all users.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Code execution may time out if it exceeds these limits. We reserve the right to modify these limits at any time without prior notice. If your code consistently exceeds resource limits or negatively impacts our infrastructure, we may restrict or suspend your access to our services.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We are not responsible for any errors, bugs, or unexpected behavior in the code you write or execute. You are solely responsible for testing and validating your code before using it in any production environment.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services and Links</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our platform may contain links to third-party websites or services that are not owned or controlled by KodeCompiler. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We may integrate with third-party services to enhance our platform's functionality. Your use of such third-party services is subject to their respective terms and conditions. We are not responsible for any issues arising from your use of third-party services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer of Warranties</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. To the fullest extent permitted by law, KodeCompiler disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not warrant that our services will be uninterrupted, secure, or error-free, that defects will be corrected, or that our services or the servers that make them available are free of viruses or other harmful components.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You acknowledge that your use of our services is at your sole risk. We do not warrant or make any representations regarding the accuracy, reliability, or completeness of any content or information provided through our services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To the maximum extent permitted by law, KodeCompiler, its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use our services.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            In no event shall our aggregate liability for all claims relating to our services exceed the amount you paid us, if any, in the twelve months preceding the claim, or one hundred dollars, whichever is greater.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. In such jurisdictions, our liability will be limited to the maximum extent permitted by law.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You agree to indemnify, defend, and hold harmless KodeCompiler, its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from your use of our services, your violation of these Terms, or your violation of any rights of another party.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This indemnification obligation will survive the termination of these Terms and your use of our services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms, violation of our Acceptable Use Policy, fraudulent activity, or if we believe your actions may cause harm to us, our services, or other users.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            You may terminate your account at any time by discontinuing use of our services and deleting your account through your account settings or by contacting us.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Upon termination, your right to use our services will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law and Dispute Resolution</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which KodeCompiler operates, without regard to its conflict of law provisions.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Any dispute arising out of or relating to these Terms or our services shall first be attempted to be resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding arbitration in accordance with the rules of the applicable arbitration authority, except where prohibited by law.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You agree to waive any right to a jury trial or to participate in a class action lawsuit or class-wide arbitration for any claims covered by these Terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">General Provisions</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms constitute the entire agreement between you and KodeCompiler regarding your use of our services and supersede all prior agreements and understandings, whether written or oral.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect. Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You may not assign or transfer these Terms or any rights granted hereunder, by operation of law or otherwise, without our prior written consent. We may assign these Terms at any time without restriction.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us. We value your input and will respond to your inquiries as promptly as possible.
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            You can reach us at:
          </p>
          <p className="text-gray-700 leading-relaxed mb-1">
            Email: <a href="mailto:legal@kodecompiler.com" className="text-blue-600 hover:underline">legal@kodecompiler.com</a>
          </p>
          <p className="text-gray-700 leading-relaxed">
            Support: <a href="mailto:support@kodecompiler.com" className="text-blue-600 hover:underline">support@kodecompiler.com</a>
          </p>
        </section>

      </main>
    </div>
  );
};

export default TermsOfService;