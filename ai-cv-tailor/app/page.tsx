'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PDFDropzone from '@/components/PDFDropzone';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import ResultDisplay from '@/components/ResultDisplay';
import DownloadButton from '@/components/DownloadButton';
import { rewriteCV } from '@/lib/api';

export default function Home() {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [optimizedResume, setOptimizedResume] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!resumeText || !jobDescription) {
      setError('Please upload your resume and paste the job description.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setOptimizedResume(null);

    const result = await rewriteCV(resumeText, jobDescription);

    if (result.error) {
      setError(result.error);
    } else {
      setOptimizedResume(result.content);
    }

    setIsProcessing(false);
  };

  const canSubmit = resumeText && jobDescription && !isProcessing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI CV Tailor
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  ATS-Optimized Resume in Seconds
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:block">
                No login required • Free to use
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
            Tailor Your Resume with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Precision
            </span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Upload your resume, paste the job description, and get an ATS-optimized version
            that highlights your relevant experience using the exact keywords recruiters are looking for.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Inputs */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">1</span>
                </div>
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">Upload Your Resume</h3>
              </div>
              <PDFDropzone onTextExtracted={setResumeText} isProcessing={isProcessing} />
            </div>

            <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">Paste Job Description</h3>
              </div>
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
                disabled={isProcessing}
              />
            </div>

            <motion.button
              onClick={handleOptimize}
              disabled={!canSubmit}
              className={`
                w-full py-4 px-6 rounded-xl font-semibold text-lg
                transition-all duration-200
                ${canSubmit
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                }
              `}
              whileHover={canSubmit ? { scale: 1.02 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Optimizing Your Resume...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Optimize Resume
                </div>
              )}
            </motion.button>
          </motion.div>

          {/* Right Column - Output */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800">
              <ResultDisplay
                content={optimizedResume}
                isLoading={isProcessing}
                error={error}
              />
            </div>

            <DownloadButton content={optimizedResume} />
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="mt-16 grid sm:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
              title: 'Privacy First',
              desc: 'Your data stays in your browser. We never store your resume.'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Lightning Fast',
              desc: 'Get your optimized resume in under 30 seconds.'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'ATS Optimized',
              desc: 'Keywords extracted directly from the job description.'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white/50 dark:bg-zinc-900/30 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-3 text-indigo-500">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{feature.title}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Built with ❤️ using Next.js, Tailwind CSS, and AI
          </p>
        </div>
      </footer>
    </div>
  );
}
