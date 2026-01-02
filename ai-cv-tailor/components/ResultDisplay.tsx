'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultDisplayProps {
    content: string | null;
    isLoading: boolean;
    error: string | null;
}

export default function ResultDisplay({ content, isLoading, error }: ResultDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (content) {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                    Optimized Resume
                </h2>
                {content && (
                    <motion.button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg
              bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300
              hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                            </>
                        )}
                    </motion.button>
                )}
            </div>

            <div className="relative rounded-2xl overflow-hidden min-h-[500px] bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-8"
                        >
                            <div className="relative mb-6">
                                <div className="w-16 h-16 rounded-full border-4 border-indigo-200 dark:border-indigo-800" />
                                <div className="absolute top-0 w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                            </div>
                            <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-2">
                                AI is optimizing your resume...
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
                                Analyzing job keywords and rewriting your experience to match the position
                            </p>

                            {/* Animated dots */}
                            <div className="flex gap-1 mt-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-indigo-500"
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-8"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-2">
                                Something went wrong
                            </h3>
                            <p className="text-sm text-red-500 text-center max-w-sm">{error}</p>
                        </motion.div>
                    ) : content ? (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 overflow-auto max-h-[600px] prose prose-zinc dark:prose-invert prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400 prose-strong:text-zinc-800 dark:prose-strong:text-zinc-200 max-w-none"
                            id="resume-output"
                        >
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-8"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-2">
                                Your optimized resume will appear here
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
                                Upload your resume and paste the job description, then click &quot;Optimize Resume&quot;
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-tl from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
}
