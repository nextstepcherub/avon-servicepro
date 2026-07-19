import React, { useState } from 'react';
import { JobRecord } from '../types';
import { Heart, Star, QrCode, Smile, MessageSquare, CheckCircle, ShieldAlert } from 'lucide-react';

interface FeedbackSimulatorProps {
  jobs: JobRecord[];
  onSubmitFeedback: (jobId: string, rating: number, nps: number, comments: string) => void;
}

export default function FeedbackSimulator({ jobs, onSubmitFeedback }: FeedbackSimulatorProps) {
  const [selectedJobId, setSelectedJobId] = useState('');
  const [rating, setRating] = useState<number>(5); // 1-5 Likert Scale
  const [nps, setNps] = useState<number>(10); // 1-10 NPS
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Filter jobs that are completed but don't have feedback yet
  const eligibleJobs = jobs.filter(j => 
    (j.status === 'Completed' || j.status === 'Invoiced' || j.status === 'Closed') && 
    !j.feedback
  );

  const activeJob = jobs.find(j => j.id === selectedJobId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      alert('Please select an installation or service job ticket.');
      return;
    }

    onSubmitFeedback(selectedJobId, rating, nps, comments);
    setSubmitted(true);
    setComments('');
    
    setTimeout(() => {
      setSubmitted(false);
      setSelectedJobId('');
    }, 2000);
  };

  const likertLabels = [
    { value: 1, text: 'Strongly Disagree' },
    { value: 2, text: 'Disagree' },
    { value: 3, text: 'Neutral' },
    { value: 4, text: 'Agree' },
    { value: 5, text: 'Strongly Agree' }
  ];

  return (
    <div id="customer_satisfaction_simulator" className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Satisfaction Hub (NPS)</h1>
        <p className="text-sm text-slate-500">Scan QR codes on job sheets to log direct customer reviews and calculate Net Promoter scores</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Customer Terminal Simulator Form */}
        <div className="lg:col-span-2 bg-gradient-to-b from-blue-900 to-slate-900 text-white p-6 rounded-3xl border border-blue-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 text-white/5 pointer-events-none">
            <Heart className="w-64 h-64" />
          </div>

          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
            <Smile className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold">Interactive Client Feedback Terminal</h3>
          </div>

          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold">Thank You, Review Submitted!</h4>
              <p className="text-sm text-blue-200">Your feedback has been registered and verified under our strict quality standard guidelines.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-blue-200 block">Select Active Completed Job Ticket *</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full border border-white/10 rounded-xl p-2.5 text-xs bg-slate-800 text-white font-semibold"
                >
                  <option value="">Choose a completed visit...</option>
                  {eligibleJobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.id} - {job.customerName} ({job.brand} {job.model} - {job.jobType})
                    </option>
                  ))}
                  {eligibleJobs.length === 0 && (
                    <option value="" disabled>No pending completed jobs await reviews (Simulate complete a job first!)</option>
                  )}
                </select>
              </div>

              {activeJob && (
                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-xs space-y-1.5">
                  <div className="font-bold text-blue-400 uppercase tracking-wider text-[9px]">Verified On-Site Dispatch Team</div>
                  <div>Primary Engineer: <span className="font-semibold text-slate-200">{activeJob.assignedEngineerName || 'Unassigned'}</span></div>
                  <div>System: <span className="font-semibold text-slate-200">{activeJob.brand} {activeJob.model}</span> (S/N: {activeJob.serialNumber})</div>
                </div>
              )}

              {/* Likert Scale */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-200 block">
                  The service engineer was highly professional and completed the installation/repair to our satisfaction:
                </label>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                  {likertLabels.map((lbl) => (
                    <button
                      key={lbl.value}
                      type="button"
                      onClick={() => setRating(lbl.value)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        rating === lbl.value
                          ? 'bg-blue-600 border-blue-500 font-extrabold text-white scale-[1.03] shadow'
                          : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-755'
                      }`}
                    >
                      <Star className={`w-4 h-4 mx-auto mb-1.5 ${rating >= lbl.value ? 'fill-white text-white' : 'text-slate-500'}`} />
                      {lbl.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* NPS Slider */}
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-blue-200">
                    How likely are you to recommend AVON PHARMO CHEM Service to other laboratories? (NPS)
                  </label>
                  <span className="text-sm font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Score: {nps} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={nps}
                  onChange={(e) => setNps(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 - Highly Unlikely</span>
                  <span>5 - Neutral</span>
                  <span>10 - Extremely Likely</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-blue-200 block flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> General Comments / Suggestions
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full border border-white/10 rounded-xl p-2 text-xs bg-slate-800 text-white h-16"
                  placeholder="Tell us what went well or how we can improve..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold p-3 rounded-xl text-xs transition-all shadow-lg cursor-pointer"
              >
                Authorize & Submit Digital Review
              </button>
            </form>
          )}
        </div>

        {/* Right: QR Code generator illustration */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm uppercase flex items-center gap-1.5">
            <QrCode className="w-5 h-5 text-blue-600" />
            On-Site QR Generator
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every physical job sheet contains a dynamically generated secure QR code. When scanned by the laboratory director or hospital supervisor, it opens the direct Likert & NPS feedback terminal.
          </p>

          {/* Simulated QR block */}
          <div className="bg-slate-50 p-6 rounded-2xl border flex flex-col items-center justify-center space-y-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                {/* Visual mock QR design */}
                <rect x="5" y="5" width="25" height="25" className="fill-slate-800" />
                <rect x="9" y="9" width="17" height="17" className="fill-white" />
                <rect x="13" y="13" width="9" height="9" className="fill-slate-800" />

                <rect x="70" y="5" width="25" height="25" className="fill-slate-800" />
                <rect x="74" y="9" width="17" height="17" className="fill-white" />
                <rect x="78" y="13" width="9" height="9" className="fill-slate-800" />

                <rect x="5" y="70" width="25" height="25" className="fill-slate-800" />
                <rect x="9" y="74" width="17" height="17" className="fill-white" />
                <rect x="13" y="78" width="9" height="9" className="fill-slate-800" />

                <rect x="35" y="35" width="30" height="30" className="fill-slate-800" />
                <rect x="40" y="40" width="20" height="20" className="fill-white" />
                
                <rect x="44" y="44" width="12" height="12" className="fill-blue-600" />
                
                {/* Random matrix dots */}
                <rect x="35" y="10" width="5" height="5" className="fill-slate-800" />
                <rect x="45" y="15" width="5" height="10" className="fill-slate-800" />
                <rect x="55" y="5" width="10" height="5" className="fill-slate-800" />
                <rect x="15" y="45" width="5" height="15" className="fill-slate-800" />
                <rect x="75" y="45" width="15" height="5" className="fill-slate-800" />
                <rect x="45" y="75" width="10" height="5" className="fill-slate-800" />
                <rect x="75" y="75" width="5" height="5" className="fill-slate-800" />
                <rect x="85" y="85" width="10" height="10" className="fill-slate-800" />
              </svg>
            </div>
            
            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Secure Verification Code</span>
              <span className="text-xs font-bold text-slate-700">QR-SECURE-AVON-9001</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 text-blue-800 border border-blue-100 rounded-xl text-[11px] flex gap-2 items-start">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold">Real-time NPS Indexing:</span> Ratings automatically compute as promoters (9-10), passives (7-8), and detractors (0-6) matching professional Net Promoter calculations.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
