import React, { useRef, useEffect, useState } from 'react';
import {
  Download,
  RotateCcw,
  ShieldCheck,
  Award,
  ArrowLeft,
  CheckCircle,
  Printer,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { CertificateData } from '../types';
import { drawCertificateCanvas, downloadCertificatePDF } from '../utils/certificate';

interface CertificateViewProps {
  theme: 'dark' | 'light';
  certificateData: CertificateData;
  onBackToResults: () => void;
  onRetakeQuiz: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  theme,
  certificateData,
  onBackToResults,
  onRetakeQuiz,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isRendering, setIsRendering] = useState(true);

  // Render high-resolution certificate canvas once fonts are ready
  useEffect(() => {
    let isCancelled = false;

    const render = () => {
      if (!isCancelled && canvasRef.current) {
        drawCertificateCanvas(canvasRef.current, certificateData);
        setIsRendering(false);
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(render);
    } else {
      render();
    }

    return () => {
      isCancelled = true;
    };
  }, [certificateData]);

  // Handle PDF Download (Exactly 1 page, A4 landscape, 0 margins, high-res)
  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCertificatePDF(canvasRef.current, certificateData.studentName);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 4000);
  };

  // Handle Print (A4 landscape, certificate only)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8 z-10">
      {/* Print Stylesheet (Inlined for guaranteed priority during window.print()) */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #FFFFFF !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide all surrounding page chrome */
          nav, header, footer, button, .no-print, #navbar, #top-navbar, #cert-action-bar, #cert-meta-strip, #cert-spec-note {
            display: none !important;
          }
          /* Present ONLY the certificate canvas full-bleed */
          #certificate-print-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            z-index: 999999 !important;
          }
          #certificate-canvas {
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            display: block !important;
            object-fit: fill !important;
          }
        }
      `}</style>

      {/* Top Action Header Bar (Excluded from print) */}
      <div id="cert-action-bar" className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          id="back-to-results-btn"
          type="button"
          onClick={onBackToResults}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="retake-from-cert-btn"
            type="button"
            onClick={onRetakeQuiz}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>

          {/* Print Certificate Button */}
          <button
            id="print-certificate-btn"
            type="button"
            onClick={handlePrint}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
                : 'bg-white hover:bg-slate-50 text-blue-900 border border-blue-200 shadow-sm'
            }`}
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Print Certificate</span>
          </button>

          {/* Download Certificate PDF Button */}
          <button
            id="download-certificate-pdf-btn"
            type="button"
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide text-white bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 hover:from-blue-600 hover:via-indigo-600 hover:to-teal-600 active:scale-[0.98] transition-all shadow-md shadow-blue-900/30 flex items-center gap-2 cursor-pointer"
          >
            {isDownloaded ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Certificate PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Certificate Meta Strip (Excluded from print) */}
      <div
        id="cert-meta-strip"
        className={`p-4 rounded-xl mb-6 border flex flex-wrap items-center justify-between gap-4 text-xs no-print ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-700/80 text-slate-300'
            : 'bg-white border-slate-200 text-slate-700 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-600" />
          <span>
            Recipient: <strong>{certificateData.studentName}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>
            Score: <strong className="text-blue-700 dark:text-cyan-400">{certificateData.scoreDisplay} ({certificateData.percentage.toFixed(1)}%)</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>Date: <strong>{certificateData.date}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>
            Certificate ID: <code className="font-mono font-bold text-amber-600 dark:text-amber-400">{certificateData.certificateId}</code>
          </span>
        </div>
      </div>

      {/* DEDICATED A4 LANDSCAPE CERTIFICATE CANVAS CONTAINER */}
      {/* Pristine presentation surface with authentic A4 aspect ratio (297 / 210) */}
      <div
        id="certificate-print-area"
        className="w-full relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 flex items-center justify-center p-0 border border-slate-300/80 bg-neutral-100 dark:bg-slate-900/60"
        style={{
          boxShadow: '0 25px 50px -12px rgba(15, 30, 54, 0.18), 0 0 0 1px rgba(15, 30, 54, 0.05)',
        }}
      >
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-amber-50/90 z-20 text-slate-800 font-mono text-sm">
            Rendering high-resolution certificate artwork...
          </div>
        )}

        <canvas
          id="certificate-canvas"
          ref={canvasRef}
          className="w-full h-auto max-w-full block object-contain"
          style={{
            aspectRatio: '297 / 210',
          }}
        />
      </div>

      {/* Specification Footnote (Excluded from print) */}
      <div id="cert-spec-note" className="mt-4 text-center text-xs text-slate-400 font-mono no-print">
        Official Specification: A4 Landscape (297mm × 210mm) • Pixel Resolution: 2480 × 1754 px • Light Achievement Edition
      </div>
    </div>
  );
};
