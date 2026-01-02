'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface DownloadButtonProps {
    content: string | null;
}

export default function DownloadButton({ content }: DownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!content) return;

        setIsDownloading(true);

        try {
            // Dynamically import html2pdf to avoid SSR issues
            const html2pdf = (await import('html2pdf.js')).default;

            // Create a temporary container with styled content
            const container = document.createElement('div');
            container.innerHTML = `
        <style>
          * { font-family: 'Georgia', serif; color: #1a1a1a; }
          h1 { font-size: 24px; margin-bottom: 16px; color: #4338ca; }
          h2 { font-size: 18px; margin-top: 20px; margin-bottom: 12px; color: #4338ca; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; }
          h3 { font-size: 16px; margin-top: 16px; margin-bottom: 8px; }
          p { font-size: 12px; line-height: 1.6; margin-bottom: 8px; }
          ul { padding-left: 20px; margin-bottom: 12px; }
          li { font-size: 12px; line-height: 1.6; margin-bottom: 4px; }
          strong { font-weight: 600; }
        </style>
        <div style="padding: 40px;">
          ${content.replace(/^# /gm, '<h1>').replace(/^## /gm, '<h2>').replace(/^### /gm, '<h3>')
                    .replace(/^- /gm, '<li>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '</p><p>').replace(/^/g, '<p>').replace(/$/, '</p>')}
        </div>
      `;

            const options = {
                margin: [10, 15, 10, 15] as [number, number, number, number],
                filename: 'optimized-resume.pdf',
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
            };

            await html2pdf().set(options).from(container).save();
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.button
            onClick={handleDownload}
            disabled={!content || isDownloading}
            className={`
        flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl
        font-medium text-white transition-all duration-200
        ${content
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25'
                    : 'bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed'
                }
      `}
            whileHover={content ? { scale: 1.02 } : {}}
            whileTap={content ? { scale: 0.98 } : {}}
        >
            {isDownloading ? (
                <>
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Preparing PDF...
                </>
            ) : (
                <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download as PDF
                </>
            )}
        </motion.button>
    );
}
