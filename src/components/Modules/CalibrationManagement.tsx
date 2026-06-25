import React, { useState } from 'react';
import { CalibrationRecord, Instrument, UserProfile } from '../../types';
import { FileText, ClipboardCopy, Medal, CheckCircle, Flame, ShieldAlert, Thermometer, Droplets, Award, Printer, BadgeCheck } from 'lucide-react';
import { canCalibrate as isCalibrationAuthorized } from '../../utils/authHelpers';

interface CalibrationManagementProps {
  calibrations: CalibrationRecord[];
  instruments: Instrument[];
  onAddCalibration: (cal: CalibrationRecord) => void;
  currentUser: UserProfile;
}

export default function CalibrationManagement({
  calibrations,
  instruments,
  onAddCalibration,
  currentUser
}: CalibrationManagementProps) {

  const [selectedCert, setSelectedCert] = useState<CalibrationRecord | null>(calibrations[0] || null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [instrumentId, setInstrumentId] = useState('');
  const [standardEquipment, setStandardEquipment] = useState('NIST Certified Caffeine standard kit (P/N 5063-6523)');
  const [temp, setTemp] = useState<number>(22.4);
  const [humidity, setHumidity] = useState<number>(45.0);
  const [reportedError, setReportedError] = useState<number>(0.05);
  const [allowableError, setAllowableError] = useState<number>(0.20);
  const [success, setSuccess] = useState('');

  // Access validation
  const canCalibrate = isCalibrationAuthorized(currentUser.role);

  const handleIssueCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instrumentId) return;

    const matchedInst = instruments.find(i => i.id === instrumentId);
    if (!matchedInst) return;

    const certId = `APCS-CAL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const passStatus = reportedError <= allowableError ? 'PASSED' : 'FAILED';

    const newCert: CalibrationRecord = {
      id: `cal-${Date.now()}`,
      certificateNo: certId,
      instrumentId: matchedInst.id,
      instrumentName: matchedInst.name,
      serialNumber: matchedInst.serialNumber,
      calibrationDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // + 1 year
      standardEquipment,
      temperature: temp,
      humidity,
      reportedError,
      allowableError,
      status: passStatus,
      calibratedBy: currentUser.name,
      approvedBy: "M. N. Jayawardene (AVON Service Manager)"
    };

    onAddCalibration(newCert);
    setSelectedCert(newCert);
    setShowCalculator(false);
    setSuccess("Metrology Verification Certificate Granted!");
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">

      {/* Hero Banner header */}
      <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 id="calibration-mgmt-title" className="text-sm font-bold text-gray-800 uppercase font-mono tracking-wider flex items-center gap-1.5 text-[#0054A6]">
            <Award className="w-5 h-5 text-[#0054A6]" /> METROLOGICAL STANDARDS & ISO-17025 VERIFICATION
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">Generate certified, NIST-traceable equipment calibration results and audit logs.</p>
        </div>

        {canCalibrate ? (
          <button
            id="open-calculator-btn"
            onClick={() => setShowCalculator(!showCalculator)}
            className="px-4 py-2 text-xs font-bold font-sans text-white bg-[#0054A6] hover:bg-blue-800 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" /> Issue ISO Certificate
          </button>
        ) : (
          <span className="text-xs font-mono text-gray-400 border border-dashed border-gray-200 p-2 rounded uppercase bg-slate-50">
            METROLOGY AUTH LOCKS DETECTED
          </span>
        )}
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-xs font-sans flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* ISO Calibration Calculation form */}
      {showCalculator && (
        <div className="bg-white rounded-lg border border-gray-100 shadow-lg p-5 animate-slide-in">
          <h3 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">AVON Metrology Bench - ISO/IEC 17025 Deviation Calculator</h3>
          <form onSubmit={handleIssueCert} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">SELECT PIPELINED INSTRUMENT</label>
              <select
                id="form-cal-instrument"
                required
                className="w-full bg-white border border-gray-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                value={instrumentId}
                onChange={(e) => setInstrumentId(e.target.value)}
              >
                <option value="">-- Choose Target Equipment --</option>
                {instruments.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} (SN: {inst.serialNumber} - {inst.customerName.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-gray-500 uppercase flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" /> TEMPERATURE (CELSIUS)
              </label>
              <input
                id="form-cal-temp"
                type="number"
                step="0.1"
                required
                className="w-full bg-white border border-gray-200 rounded p-2 text-xs"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-gray-500 uppercase flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" /> AMBIENT HUMIDITY (%)
              </label>
              <input
                id="form-cal-humidity"
                type="number"
                step="0.1"
                required
                className="w-full bg-white border border-gray-200 rounded p-2 text-xs"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">REFERENCE STANDARDS & METROLOGICAL EQUIPMENT USED</label>
              <input
                id="form-cal-standards"
                type="text"
                required
                className="w-full bg-white border border-gray-200 rounded p-2 text-xs placeholder-gray-300 focus:ring-1 focus:ring-[#0054A6]"
                value={standardEquipment}
                onChange={(e) => setStandardEquipment(e.target.value)}
                placeholder="e.g. Class E2 analytical mass standards Traceable to NIST"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-[#DC2626] uppercase">REPORTED ABSOLUTE ERROR (%)</label>
              <input
                id="form-cal-reported-error"
                type="number"
                step="0.001"
                required
                className="w-full bg-white border border-red-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#DC2626]"
                value={reportedError}
                onChange={(e) => setReportedError(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-[#0054A6] uppercase">ALLOWABLE TOLERANCE THRESHOLD (%)</label>
              <input
                id="form-cal-allowable-error"
                type="number"
                step="0.001"
                required
                className="w-full bg-white border border-blue-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#0054A6]"
                value={allowableError}
                onChange={(e) => setAllowableError(Number(e.target.value))}
              />
            </div>

            <div className="md:col-span-3 pt-3 flex justify-between items-center bg-slate-50 p-4 border rounded border-gray-100 mt-2">
              <div className="text-xs">
                <span className="font-bold text-gray-700">Dynamic Verdict:</span>{' '}
                {reportedError <= allowableError ? (
                  <span className="text-[#22C55E] font-bold">● PASSED (Within standard metrology tolerances)</span>
                ) : (
                  <span className="text-[#DC2626] font-bold">▲ FAILED (Tolerances violated! Repair needed!)</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  id="cancel-cal-btn"
                  onClick={() => setShowCalculator(false)}
                  className="px-4 py-2 border border-gray-200 bg-white rounded text-xs text-gray-650 hover:bg-slate-50 font-sans font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-cal-btn"
                  className="px-4 py-2 rounded text-xs text-white bg-[#0054A6] hover:bg-blue-800 font-sans font-bold cursor-pointer"
                >
                  Issue Certified Document
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Grid: past certificates list vs full preview card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Previous certificates stack */}
        <div className="lg:col-span-1 space-y-3 bg-white p-4 border border-gray-100 rounded-lg">
          <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest pb-2 border-b">Metrological Certificates Drawer</h3>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {calibrations.map(cal => {
              const isActive = selectedCert?.id === cal.id;
              return (
                <button
                  key={cal.id}
                  id={`cert-select-btn-${cal.id}`}
                  onClick={() => setSelectedCert(cal)}
                  className={`w-full text-left p-3 border rounded transition-all flex items-center justify-between cursor-pointer ${
                    isActive ? 'bg-[#F5F8FC] border-[#0054A6] shadow-xs' : 'border-gray-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 font-bold block">{cal.certificateNo}</span>
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{cal.instrumentName}</h4>
                    <span className="text-[10px] font-sans text-gray-500 block">SN DETAILS: {cal.serialNumber}</span>
                  </div>
                  
                  <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                    cal.status === 'PASSED' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-[#DC2626]'
                  }`}>
                    {cal.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic preview sheet: mimicking formal medical lab report layout */}
        <div className="lg:col-span-2">
          {selectedCert ? (
            <div className="bg-[#FAFBFD] rounded-lg border-2 border-dashed border-gray-200 p-8 shadow-sm print-area flex flex-col justify-between">
              
              {/* Document Header */}
              <div className="border-b-2 border-gray-100 pb-5 text-center flex flex-col items-center">
                <div className="p-2.5 bg-blue-100 text-[#0054A6] rounded-full mb-2">
                  <Medal className="w-5 h-5 text-[#0054A6]" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0054A6] uppercase font-mono tracking-widest">AVON PHARMO CHEM (PVT) LTD</h4>
                <p className="text-[10px] text-gray-400 font-mono tracking-wider mt-0.5">METROLOGICAL CENTER & ACCREDITED CALIBRATION LABORATORY</p>
                <div className="text-[9px] text-gray-400 font-sans italic mt-1">Conforming to ISO/IEC 17025 General Metrological Guidelines</div>
              </div>

              {/* Certificate Metadata fields */}
              <div className="grid grid-cols-2 gap-4 py-5 text-xs text-gray-600 font-sans border-b border-gray-50">
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[#0054A6] font-bold font-mono uppercase block text-[9px]">CERTIFICATE NUMBER:</span>
                    <span className="font-mono text-gray-800 font-extrabold">{selectedCert.certificateNo}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase block text-[9px]">CALIBRATION HARDWARE:</span>
                    <span className="font-bold text-gray-800">{selectedCert.instrumentName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase block text-[9px]">SERIAL IDENTITY:</span>
                    <span className="font-mono font-bold text-gray-700">{selectedCert.serialNumber}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-right">
                  <div>
                    <span className="text-gray-400 uppercase block text-[9px]">CALIBRATION STAMP DATE:</span>
                    <span className="font-mono font-semibold text-gray-750">{selectedCert.calibrationDate}</span>
                  </div>
                  <div>
                    <span className="text-red-500 font-mono font-bold uppercase block text-[9px]">RECALIBRATION DEADLINE:</span>
                    <span className="font-mono font-bold text-red-650">{selectedCert.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase block text-[9px]">REFERENCE STANDARDS TRACEABILITY:</span>
                    <span className="text-[10px] text-gray-700 block italic leading-tight max-w-[220px] ml-auto">
                      {selectedCert.standardEquipment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Environmental variables table */}
              <div className="grid grid-cols-4 gap-2 text-center py-4 bg-[#F5F8FC]/50 border-b border-gray-100 rounded mt-3">
                <div className="border-r border-gray-150">
                  <span className="text-[9px] text-gray-400 uppercase block">AMBIENT TEMP</span>
                  <span className="font-mono font-bold text-gray-850">{selectedCert.temperature} °C</span>
                </div>
                <div className="border-r border-gray-150">
                  <span className="text-[9px] text-gray-400 uppercase block font-sans">AMBIENT HUMIDITY</span>
                  <span className="font-mono font-bold text-gray-850">{selectedCert.humidity} %</span>
                </div>
                <div className="border-r border-gray-150">
                  <span className="text-[9px] text-gray-450 uppercase block font-sans">REPORTED FAULT</span>
                  <span className="font-mono font-bold text-[#DC2626]">{selectedCert.reportedError} %</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-450 uppercase block font-sans">ALLOWABLE TOL</span>
                  <span className="font-mono font-bold text-[#0054A6]">{selectedCert.allowableError} %</span>
                </div>
              </div>

              {/* Verified Badge seal */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-1 px-3 rounded-full font-mono text-[11px] font-bold border ${
                    selectedCert.status === 'PASSED' 
                      ? 'bg-emerald-55/15 text-emerald-800 border-emerald-300' 
                      : 'bg-red-55/15 text-red-700 border-red-300'
                  }`}>
                    ● DYNAMIC VERDICT: {selectedCert.status}
                  </div>
                  <span className="text-[11px] font-mono text-gray-300">|</span>
                  <span className="text-[10px] italic text-[#0077C8] font-sans">NIST COMPLIANCE APPROVED</span>
                </div>

                <div className="text-right space-y-1 text-[10px] leading-tight font-sans">
                  <div>
                    <span className="text-gray-400 uppercase block text-[8px]">CERTIFYING ENGINEER:</span>
                    <span className="font-bold text-gray-700">{selectedCert.calibratedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase block text-[8px]">METROLOGY ENDORSER:</span>
                    <span className="font-semibold text-gray-600">{selectedCert.approvedBy}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-[#F5F8FC] border border-gray-200 rounded-lg p-12 text-center text-gray-500 h-[380px] flex items-center justify-center">
              <p className="font-sans text-sm">Select a Metrology Certificate to view formal ISO print layout.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
