
import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="glass p-10 md:p-16 rounded-[3rem] border-t-8 border-red-500">
        <h1 className="text-3xl font-bold dark:text-white mb-8 text-center">Important Legal Disclaimer</h1>
        
        <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="font-bold text-red-600 dark:text-red-400">
            Please read this carefully before using the NagrikAi platform.
          </p>
          
          <section>
            <h2 className="text-xl font-bold dark:text-white mb-3">1. Not a Lawyer Replacement</h2>
            <p>
              NagrikAi is an AI-powered educational tool. It is NOT a lawyer, a law firm, or a substitute for professional legal advice. The information provided is for general awareness only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold dark:text-white mb-3">2. No Lawyer-Client Relationship</h2>
            <p>
              Your use of this website, or your interaction with our AI assistant, does not create a lawyer-client relationship between you and NagrikAi or any of its creators.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold dark:text-white mb-3">3. Accuracy of Information</h2>
            <p>
              Laws change frequently. While we strive to provide accurate and up-to-date information, the AI may occasionally make mistakes or provide outdated guidance. Always verify critical legal steps with the official Gazette of India or a qualified advocate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold dark:text-white mb-3">4. Limitation of Liability</h2>
            <p>
              NagrikAi will not be held responsible for any decisions made based on the information provided on this platform. Use this tool as a starting point for your research, not as the final word.
            </p>
          </section>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 mt-10">
            <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Public Legal Aid</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              If you cannot afford a lawyer, you have a constitutional right to free legal aid in India. Contact the <strong>National Legal Services Authority (NALSA)</strong> at their toll-free number: <strong>15100</strong>.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => window.location.hash = 'home'}
            className="px-8 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            I Understand, Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
