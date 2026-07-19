import React, { useState } from 'react';
import { CSATRecord, Customer, UserProfile } from '../../types';
import { Sparkles, MessageSquare, ThumbsUp, HeartHandshake, Smile, Star, Plus } from 'lucide-react';
import { isManager } from '../../utils/authHelpers';

interface FeedbackNPSProps {
  csatRecords: CSATRecord[];
  customers: Customer[];
  onAddFeedback: (record: CSATRecord) => void;
  currentUser: UserProfile;
}

export default function FeedbackNPS({
  csatRecords,
  customers,
  onAddFeedback,
  currentUser
}: FeedbackNPSProps) {

  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [ticketNo, setTicketNo] = useState('AVN-RPR-2026-001');
  const [serviceRating, setServiceRating] = useState<number>(5);
  const [supportRating, setSupportRating] = useState<number>(5);
  const [nps, setNps] = useState<number>(10);
  const [comment, setComment] = useState('');

  // Calculate NPS mathematically
  // Promoters: 9-10, Passives: 7-8, Detractors: 0-6
  const totalFeedbackCount = csatRecords.length;
  const promotersCount = csatRecords.filter(f => f.npsScore >= 9).length;
  const detractorsCount = csatRecords.filter(f => f.npsScore <= 6).length;
  
  const promotersPercent = totalFeedbackCount > 0 ? (promotersCount / totalFeedbackCount) * 100 : 0;
  const detractorsPercent = totalFeedbackCount > 0 ? (detractorsCount / totalFeedbackCount) * 100 : 0;
  const mathNpsScore = Math.round(promotersPercent - detractorsPercent);

  // Calculate generic Star Average
  const averageStars = totalFeedbackCount > 0 
    ? (csatRecords.reduce((acc, f) => acc + f.serviceRating, 0) / totalFeedbackCount).toFixed(1)
    : '5.0';

  const handlePostSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !comment) return;

    const linkedCust = customers.find(c => c.id === selectedCustomerId);
    if (!linkedCust) return;

    const newRec: CSATRecord = {
      id: `csat-${Date.now()}`,
      ticketId: `tkt-${Date.now()}`,
      ticketNumber: ticketNo,
      customerId: linkedCust.id,
      customerName: linkedCust.name,
      serviceRating,
      supportRating,
      npsScore: nps,
      feedbackText: comment,
      date: new Date().toISOString().split('T')[0]
    };

    onAddFeedback(newRec);
    
    // reset
    setSelectedCustomerId('');
    setComment('');
    setShowSurvey(false);
  };

  return (
    <div className="space-y-6">

      {/* Action triggers */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 id="csat-nps-title" className="text-2xl font-bold font-sans text-[#0054A6] tracking-tight">Satisfaction & Experience Metrics</h2>
          <p className="text-xs text-gray-500 font-sans">Track Net Promoter Scores (NPS) and Customer Satisfaction index levels (CSAT) metrics.</p>
        </div>
        
        {currentUser.role === 'CUSTOMER' || isManager(currentUser.role) ? (
          <button
            id="open-survey-btn"
            onClick={() => setShowSurvey(!showSurvey)}
            className="px-4 py-2 text-xs font-bold font-sans text-white bg-[#0054A6] hover:bg-blue-800 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all self-end md:self-auto"
          >
            <Plus className="w-4 h-4" /> Log Customer Review
          </button>
        ) : (
          <span className="text-xs font-mono text-gray-400 border border-dashed border-gray-200 p-2 rounded uppercase bg-slate-50">
            LOGS RESTRICTED TO CLIENT ACCOUNTS
          </span>
        )}
      </div>

      {/* Bento Grid: Satisfaction KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div id="nps-score-card" className="bg-white p-5 rounded-lg border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-gray-400 block uppercase">Calculated NPS Rating</span>
            <h3 className="text-3xl font-extrabold font-mono text-indigo-700">{mathNpsScore > 0 ? `+${mathNpsScore}` : mathNpsScore}</h3>
            <p className="text-xs text-emerald-600 font-sans mt-1">Excellent range (+50 to +100)</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-full">
            <HeartHandshake className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div id="csat-average-card" className="bg-white p-5 rounded-lg border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-gray-400 block uppercase">CSAT Stars Average</span>
            <h3 className="text-3xl font-extrabold font-mono text-[#0054A6] flex items-center gap-1">
              <span>{averageStars}</span>
              <Star className="w-6 h-6 fill-amber-400 stroke-amber-400" />
            </h3>
            <p className="text-xs text-emerald-600 font-sans mt-1">Target threshold: 4.5 Stars Min</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Smile className="w-5 h-5 text-[#0054A6]" />
          </div>
        </div>

        {/* Metric 3 */}
        <div id="promoters-detractors-card" className="bg-white p-5 rounded-lg border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-gray-400 block uppercase">Promoters Split Ratio</span>
            <div className="text-xs font-mono font-bold text-gray-700 flex items-center gap-4 mt-1">
              <div>
                <span className="text-emerald-600 block">Promoters (9-10):</span>
                <span className="text-base font-extrabold">{promotersPercent.toFixed(0)}%</span>
              </div>
              <div className="border-l border-gray-150 h-6"></div>
              <div>
                <span className="text-red-500 block">Detractors (0-6):</span>
                <span className="text-base font-extrabold">{detractorsPercent.toFixed(0)}%</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-full">
            <ThumbsUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Survey form overlay */}
      {showSurvey && (
        <div className="bg-white rounded-lg border border-gray-100 shadow-lg p-5 animate-slide-in">
          <h3 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">Record AVON Metrological Calibration Audit Review</h3>
          <form onSubmit={handlePostSurvey} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">OFFICIAL HOSPITAL ACCOUNT</label>
              <select
                id="form-feedback-customer"
                required
                className="w-full bg-white border border-gray-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#0054A6]"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">-- Choose Account client --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">TICKET IDENTIFICATION REF</label>
              <input
                id="form-feedback-ticket"
                type="text"
                required
                className="w-full bg-white border border-gray-200 rounded p-2 text-xs font-mono placeholder-gray-300"
                placeholder="e.g. AVN-RPR-2026-004"
                value={ticketNo}
                onChange={(e) => setTicketNo(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">CALIBRATION / SERVICE ACCURACY RATING (1-5)</label>
              <select
                id="form-feedback-servicerating"
                className="w-full bg-white border border-gray-200 rounded p-2 text-xs"
                value={serviceRating}
                onChange={(e) => setServiceRating(Number(e.target.value))}
              >
                <option value={5}>★★★★★ 5 - Flawless Metrological Tolerance</option>
                <option value={4}>★★★★☆ 4 - Standard pass deviation criteria</option>
                <option value={3}>★★★☆☆ 3 - Moderate time slippage</option>
                <option value={2}>★★☆☆☆ 2 - Heavy baseline noise reported</option>
                <option value={1}>★☆☆☆☆ 1 - Critical failure during auditing</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">LIKELIHOOD TO RECOMMEND AVON SERVICE CENTRE (NPS 0-10)</label>
              <select
                id="form-feedback-nps"
                className="w-full bg-white border border-gray-200 rounded p-2 text-xs font-mono"
                value={nps}
                onChange={(e) => setNps(Number(e.target.value))}
              >
                {[...Array(11).keys()].reverse().map(num => (
                  <option key={num} value={num}>
                    {num} - {num >= 9 ? 'Promoter (Outstanding)' : num >= 7 ? 'Passive' : 'Detractor (Poor)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">WRITTEN VERBAL TESTIMONIAL</label>
              <textarea
                id="form-feedback-comment"
                required
                rows={3}
                className="w-full bg-white border border-gray-200 rounded p-2 text-xs placeholder-gray-300"
                placeholder="Detail accuracy of calibration results, engineer response time, or custom recommendations..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t mt-2">
              <button
                type="button"
                id="cancel-feedback-btn"
                onClick={() => setShowSurvey(false)}
                className="px-4 py-2 border border-gray-200 rounded text-xs text-gray-650 hover:bg-slate-50 font-sans font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-feedback-btn"
                className="px-4 py-2 rounded text-xs text-white bg-[#0054A6] hover:bg-blue-800 font-sans font-bold cursor-pointer"
              >
                Transmit Experience Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid: testimonial cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {csatRecords.map(rec => (
          <div key={rec.id} className="bg-white p-5 rounded-lg border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{rec.customerName}</h4>
                  <span className="text-[9px] font-mono text-gray-400 uppercase">TICKET: {rec.ticketNumber}</span>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 rounded border border-amber-100 p-1 px-2 text-xs font-mono font-bold text-amber-800">
                  <span>{rec.serviceRating}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                </div>
              </div>

              <p className="text-xs font-sans text-gray-600 italic leading-relaxed">
                "{rec.feedbackText}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> NPS VERDICT: <span className="font-bold text-blue-700">{rec.npsScore}/10</span>
              </span>
              <span>{rec.date}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
