import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-blue-100">Last updated: December 6, 2025</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At KodeCompiler, we prioritize your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or use our online coding platform.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By using KodeCompiler (kodecompiler.com), you consent to the practices described in this policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We collect several types of information to provide and improve our services. This includes code and execution data such as source code submitted for compilation, input data for execution, and programming language selections. Please note that all code is deleted immediately after execution and is never stored on our servers.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you create an account, we collect account information including your email address, username, saved code snippets, and profile preferences. We also collect usage data such as your IP address, device information, pages visited, features used, and compilation statistics to help us understand how our platform is being used and to improve the user experience.
          </p>
          <p className="text-gray-700 leading-relaxed">
            When you contact us for support or inquiries, we collect contact information including your name, email address, and the content of your messages.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use the information we collect to provide and maintain our online compiler platform, including executing your code securely in isolated Docker containers. This allows us to deliver a fast, reliable, and secure coding experience.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your information helps us improve platform performance and user experience through analytics and feedback. We analyze usage patterns to identify areas for improvement and to develop new features that better serve our users.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We also use your information to provide customer support, respond to your inquiries, monitor for security threats, and prevent abuse of our platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Security and Privacy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your code security is our top priority. We want to be absolutely clear: your code is never stored, shared, or analyzed beyond the immediate execution process. When you submit code to our platform, it is processed temporarily in secure, isolated Docker containers and is automatically deleted immediately after compilation completes.
          </p>
          <p className="text-gray-700 leading-relaxed">
            All code transmission occurs over HTTPS encrypted connections, ensuring that your code remains private during transfer. We employ industry-standard security measures including container isolation, automatic cleanup processes, and strict access controls to protect your intellectual property.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information to third parties. Your privacy is important to us, and we only share data in very limited circumstances.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may share information with trusted service providers who help us operate our platform, such as hosting providers, analytics services, and customer support tools. These providers are contractually obligated to protect your information and may only use it for the specific purposes we authorize.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We may also disclose information when required by law, to comply with legal processes, to protect our legal rights, or in connection with a business transfer or acquisition.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You have several rights regarding your personal information. You can access your personal data at any time through your account settings, and you can request corrections if any information is inaccurate or incomplete.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you wish to delete your account, you can do so through your account settings or by contacting us directly. Upon account deletion, we will remove your personal information from our systems, though we may retain certain data as required by law or for legitimate business purposes.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You also have the right to opt-out of marketing communications at any time by following the unsubscribe links in our emails or updating your communication preferences in your account settings.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We retain different types of data for different periods. Source code is never stored on our servers - it is deleted immediately after execution. Analytics and usage data is retained for up to 12 months to help us improve our services. Account data is retained until you request deletion of your account. System logs and security data are typically retained for 30 days.
          </p>
          <p className="text-gray-700 leading-relaxed">
            When data is no longer needed, we securely delete or anonymize it in accordance with our data retention policies and applicable laws.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences, analyze usage patterns, and provide personalized features.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You can control cookie settings through your browser preferences. However, please note that disabling certain cookies may affect the functionality of our platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately so we can delete such information from our systems.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your information may be transferred to and processed in countries other than your country of residence. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make significant changes, we will notify you by posting the updated policy on this page and updating the "Last updated" date at the top.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please don't hesitate to contact us. We're here to help and will respond to your inquiry as promptly as possible.
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            You can reach us at:
          </p>
          <p className="text-gray-700 leading-relaxed mb-1">
            Email: <a href="mailto:privacy@kodecompiler.com" className="text-blue-600 hover:underline">privacy@kodecompiler.com</a>
          </p>
          <p className="text-gray-700 leading-relaxed">
            Support: <a href="mailto:support@kodecompiler.com" className="text-blue-600 hover:underline">support@kodecompiler.com</a>
          </p>
        </section>

      </main>

    </div>
  );
};

export default PrivacyPolicy;