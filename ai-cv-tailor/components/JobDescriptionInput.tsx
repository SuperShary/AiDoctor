'use client';

import { motion } from 'framer-motion';

interface JobDescriptionInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
}

export default function JobDescriptionInput({ value, onChange, disabled }: JobDescriptionInputProps) {
    const charCount = value.length;
    const maxChars = 10000;

    return (
        <div className="w-full">
            <label
                htmlFor="job-description"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
                Job Description
            </label>
            <div className="relative">
                <motion.textarea
                    id="job-description"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder="Paste the target job description here...

Example:
We are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js. The ideal candidate will have experience with cloud platforms (AWS/GCP), CI/CD pipelines, and agile methodologies..."
                    className={`
            w-full h-64 p-4 rounded-2xl resize-none
            bg-white dark:bg-zinc-900
            border-2 border-zinc-200 dark:border-zinc-700
            text-zinc-800 dark:text-zinc-200
            placeholder:text-zinc-400 dark:placeholder:text-zinc-500
            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
            transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                    maxLength={maxChars}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                />

                {/* Character count */}
                <div className="absolute bottom-3 right-3 text-xs text-zinc-400 dark:text-zinc-500">
                    {charCount.toLocaleString()} / {maxChars.toLocaleString()}
                </div>

                {/* Decorative gradient */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-tl from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
}
