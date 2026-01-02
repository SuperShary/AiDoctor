'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromPDF } from '@/lib/pdfUtils';

interface PDFDropzoneProps {
    onTextExtracted: (text: string) => void;
    isProcessing: boolean;
}

export default function PDFDropzone({ onTextExtracted, isProcessing }: PDFDropzoneProps) {
    const [fileName, setFileName] = useState<string | null>(null);
    const [extracting, setExtracting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setFileName(file.name);
        setError(null);
        setExtracting(true);

        try {
            const text = await extractTextFromPDF(file);
            onTextExtracted(text);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to extract text');
            setFileName(null);
        } finally {
            setExtracting(false);
        }
    }, [onTextExtracted]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5MB
        disabled: isProcessing,
    });

    // Extract dropzone props without conflicting event handlers
    const rootProps = getRootProps();

    return (
        <div className="w-full">
            <div {...rootProps}>
                <motion.div
                    className={`
                        relative overflow-hidden rounded-2xl border-2 border-dashed p-8 
                        transition-all duration-300 cursor-pointer
                        ${isDragActive && !isDragReject
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                            : isDragReject
                                ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
                                : fileName
                                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20'
                                    : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50'
                        }
                        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    whileHover={{ scale: isProcessing ? 1 : 1.01 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.99 }}
                >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[160px]">
                        <AnimatePresence mode="wait">
                            {extracting ? (
                                <motion.div
                                    key="extracting"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-800" />
                                        <div className="absolute top-0 w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                                    </div>
                                    <p className="text-zinc-600 dark:text-zinc-400">Extracting text...</p>
                                </motion.div>
                            ) : fileName ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-zinc-800 dark:text-zinc-200">{fileName}</p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Resume extracted successfully</p>
                                    </div>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Drop another file to replace</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <div className={`
                                        w-16 h-16 rounded-2xl flex items-center justify-center
                                        ${isDragActive
                                            ? 'bg-indigo-100 dark:bg-indigo-900/50'
                                            : 'bg-zinc-100 dark:bg-zinc-800'
                                        }
                                    `}>
                                        <svg className={`w-8 h-8 ${isDragActive ? 'text-indigo-500' : 'text-zinc-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                                        </p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            or click to browse (PDF, max 5MB)
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Decorative gradient */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 text-sm text-red-500 text-center"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
