import React, { useState, useMemo } from 'react';
import { 
  SUPABASE_SQL, 
  API_ARCHITECTURE, 
  SCHEMA_METADATA 
} from '../../data/dbSchema';
import {
  JOB_NUMBER_FORMATS,
  ER_DIAGRAM_ASCII,
  JOB_NUMBER_PLPGSQL,
  SUPABASE_SQL_V2,
  V2_ENGINE_BREAKDOWN
} from '../../data/dbSchemaV2';
import { 
  Database, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Server, 
  Search, 
  ArrowRightLeft, 
  Activity, 
  Info, 
  Lock, 
  Code,
  Copy, 
  Check, 
  Network,
  Cpu,
  Bookmark,
  RefreshCw,
  Eye,
  AlertTriangle,
  History,
  Sparkles,
  Layers,
  Key,
  Terminal,
  Play,
  QrCode,
  Workflow,
  Wrench,
  Clock,
  Briefcase
} from 'lucide-react';

export default function ArchitectHub() {
  const [schemaVersion, setSchemaVersion] = useState<'V2_UPGRADE' | 'V1_LEGACY'>('V2_UPGRADE');
  const [v2SubTab, setV2SubTab] = useState<'ERD' | 'GENERATOR' | 'DDL' | 'ENGINES'>('ERD');
  const [v1SubTab, setV1SubTab] = useState<'VISUAL' | 'SQL' | 'API' | 'RLS_SECURITY'>('VISUAL');

  // Copy controllers
  const [copied, setCopied] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // V2 Sandbox States
  const [selectedSandboxJobType, setSelectedSandboxJobType] = useState<string>('INSTALLATION');
  const [generatedJobNo, setGeneratedJobNo] = useState<string>('INS-2026-00001');
  const [simulatedSeqCount, setSimulatedSeqCount] = useState<number>(1);
  const [activeEngineIndex, setActiveEngineIndex] = useState<number>(0);

  // V1 States
  const [selectedTableId, setSelectedTableId] = useState<string>('m-1');
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');

  const handleCopyText = (text: string, isSql: boolean = false) => {
    navigator.clipboard.writeText(text).then(() => {
      if (isSql) {
        setSqlCopied(true);
        setTimeout(() => setSqlCopied(false), 2500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }).catch(err => console.error('Copy failed', err));
  };

  const triggerNextJobNo = () => {
    const nextCount = simulatedSeqCount + 1;
    setSimulatedSeqCount(nextCount);
    const format = JOB_NUMBER_FORMATS.find(f => f.type === selectedSandboxJobType) || JOB_NUMBER_FORMATS[0];
    const zeroPadded = String(nextCount).padStart(5, '0');
    setGeneratedJobNo(`${format.prefix}-2026-${zeroPadded}`);
  };

  const handleJobTypeChange = (typeVal: string) => {
    setSelectedSandboxJobType(typeVal);
    const format = JOB_NUMBER_FORMATS.find(f => f.type === typeVal) || JOB_NUMBER_FORMATS[0];
    setGeneratedJobNo(`${format.prefix}-2026-${String(simulatedSeqCount).padStart(5, '0')}`);
  };

  // Filter legacy tables
  const filteredLegacyTables = useMemo(() => {
    if (!tableSearchQuery.trim()) return SCHEMA_METADATA;
    const q = tableSearchQuery.toLowerCase();
    return SCHEMA_METADATA.filter(table => 
      table.name.toLowerCase().includes(q) || 
      table.module.toLowerCase().includes(q) ||
      table.description.toLowerCase().includes(q)
    );
  }, [tableSearchQuery]);

  const activeLegacyTable = useMemo(() => {
    return SCHEMA_METADATA.find(t => t.id === selectedTableId) || SCHEMA_METADATA[0];
  }, [selectedTableId]);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Global Title Banner Switcher */}
      <div className="bg-[#0D1B2A] text-white p-6 rounded-xl border border-blue-950 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Database className="w-80 h-80 text-blue-400" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-start gap-4 shrink-0">
            <div className="bg-gradient-to-br from-[#0054A6] to-cyan-600 p-3.5 rounded-xl shadow-md border border-blue-400/30 text-white">
              <Workflow className="w-7 h-7 stroke-[2]" />
            </div>
            <div className="text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2.5 py-0.5 rounded border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" /> V2 Enterprise Upgrade Active
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono font-bold px-2 py-0.5 rounded border border-blue-500/30 uppercase">
                  Supabase PostgreSQL Engine
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                  ISO 17025 Traceable
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight font-sans mt-1.5 text-white">
                AVON ServicePro V2 Database Architecture
              </h1>
              <p className="text-xs text-slate-300 font-sans mt-1 max-w-3xl leading-relaxed">
                Redesigned specifically for AVON PHARMO CHEM (PVT) LTD Service Centre. Implements a unified Central Job Master Engine connecting 12 operational domains with atomic job numbering and strict RLS security.
              </p>
            </div>
          </div>

          {/* Primary Schema Version Selector Toggle */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700/80 shadow-inner shrink-0">
            <button
              onClick={() => setSchemaVersion('V2_UPGRADE')}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer ${
                schemaVersion === 'V2_UPGRADE' 
                  ? 'bg-gradient-to-r from-[#0054A6] to-blue-600 text-white shadow-md border border-blue-400/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-cyan-400" /> V2 Enterprise Upgrade (12 Parts)
            </button>
            <button
              onClick={() => setSchemaVersion('V1_LEGACY')}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer ${
                schemaVersion === 'V1_LEGACY' 
                  ? 'bg-slate-700 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4 text-slate-400" /> V1 Legacy Tables (34 Units)
            </button>
          </div>
        </div>

        {/* V2 Sub-Navigation Bar */}
        {schemaVersion === 'V2_UPGRADE' && (
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800/80 relative z-10">
            <button
              onClick={() => setV2SubTab('ERD')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                v2SubTab === 'ERD' ? 'bg-[#00AEEF] text-slate-950 shadow-sm' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Network className="w-3.5 h-3.5" /> 1. Full ER Diagram & Topology
            </button>
            <button
              onClick={() => setV2SubTab('GENERATOR')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                v2SubTab === 'GENERATOR' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> 2. Atomic Job Number Generator
            </button>
            <button
              onClick={() => setV2SubTab('DDL')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                v2SubTab === 'DDL' ? 'bg-emerald-400 text-slate-950 shadow-sm' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> 3. PostgreSQL DDL & RLS Policies
            </button>
            <button
              onClick={() => setV2SubTab('ENGINES')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                v2SubTab === 'ENGINES' ? 'bg-indigo-400 text-slate-950 shadow-sm' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> 4. 12 Enterprise Engines Deep Dive
            </button>
          </div>
        )}

        {/* V1 Legacy Sub-Navigation Bar */}
        {schemaVersion === 'V1_LEGACY' && (
          <div className="flex gap-2 mt-6 pt-5 border-t border-slate-800/80">
            {(['VISUAL', 'SQL', 'API', 'RLS_SECURITY'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setV1SubTab(tab)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  v1SubTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {tab === 'VISUAL' ? 'Table Explorer' : tab === 'SQL' ? 'V1 SQL Dump' : tab === 'API' ? 'REST Spec' : 'RLS Rules'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ==================================================================================================== */}
      {/* SECTION A: V2 ENTERPRISE ARCHITECTURE UPGRADE WORKSPACE */}
      {/* ==================================================================================================== */}
      {schemaVersion === 'V2_UPGRADE' && (
        <div className="space-y-6">

          {/* SUB-TAB 1: ER DIAGRAM & ARCHITECTURE TOPOLOGY */}
          {v2SubTab === 'ERD' && (
            <div className="space-y-6">
              
              {/* Architectural Concept Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-left">
                  <div className="p-2.5 bg-blue-50 text-[#0054A6] rounded-lg inline-block font-bold mb-2">
                    🎯 Master Job Centralization (Part 1)
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Unified Hub Topology</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Unlike V1 which fragmented operations into 34 isolated tables, V2 introduces <code className="bg-slate-100 text-blue-700 px-1 font-mono font-bold">public.jobs</code> as the single source of truth. Every repair, installation, and calibration links directly via Foreign Key cascades.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-left">
                  <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg inline-block font-bold mb-2">
                    👥 Multi-Assignee Engine (Part 2)
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Collaborative Roster RLS</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Supports complex diagnostic teams through <code className="bg-slate-100 text-purple-700 px-1 font-mono font-bold">job_assignments</code>. Area Engineers, Bench Specialists, and Calibration Officers simultaneously log hours and status against the exact same master job.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-left">
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg inline-block font-bold mb-2">
                    ⏱️ Parts SLA Pause Trigger (Part 7)
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">PL/pgSQL Event Interceptors</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Includes automated database triggers <code className="bg-slate-100 text-emerald-700 px-1 font-mono font-bold">trg_start_sla_on_parts_received</code>. When spare parts reach 'Received' status, repair SLA countdowns automatically resume without manual intervention.
                  </p>
                </div>
              </div>

              {/* ER Diagram ASCII Display Panel */}
              <div className="bg-[#0b131e] rounded-xl border border-slate-800 shadow-md p-6 overflow-x-auto text-left">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                      V2 Normalized Relational Schema Graph (Supabase Postgres 15+)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyText(ER_DIAGRAM_ASCII)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Graph Copied" : "Copy ASCII Graph"}
                  </button>
                </div>

                <pre className="text-[11px] font-mono leading-relaxed text-emerald-400/90 overflow-x-auto p-4 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  {ER_DIAGRAM_ASCII}
                </pre>
              </div>

            </div>
          )}

          {/* SUB-TAB 2: JOB NUMBER AUTO GENERATOR & PLPGSQL SANDBOX */}
          {v2SubTab === 'GENERATOR' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
              
              {/* Interactive Simulator Card */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-mono font-bold px-2 py-0.5 rounded border border-amber-200 uppercase">
                    Requirement #7 Sandbox
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-sans mt-1">
                    Atomic Job Number Auto-Generator
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Test the V2 atomic formatting specification. Select an AVON operational job type to simulate sequence triggers.
                  </p>
                </div>

                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase block font-mono">
                      Target Job Category Type
                    </label>
                    <select
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      value={selectedSandboxJobType}
                      onChange={e => handleJobTypeChange(e.target.value)}
                    >
                      {JOB_NUMBER_FORMATS.map(fmt => (
                        <option key={fmt.type} value={fmt.type}>
                          {fmt.type} ({fmt.prefix}-YYYY)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-[#0D1B2A] rounded-xl border border-slate-800 text-center relative overflow-hidden">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-widest">
                      Simulated Postgres Trigger Result
                    </span>
                    <div className="text-2xl font-black font-mono text-amber-400 tracking-wider mt-1.5 py-2">
                      {generatedJobNo}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                      ✅ Atomic Sequence NextVal Executed
                    </span>
                  </div>

                  <button
                    onClick={triggerNextJobNo}
                    className="w-full py-2.5 bg-[#0054A6] hover:bg-blue-800 text-white font-bold rounded-lg text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-4 h-4" /> Simulate Next Database Insertion (+1)
                  </button>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <h4 className="text-xs font-bold text-slate-800 font-mono uppercase">
                    📋 Supported V2 Format Matrix:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    {JOB_NUMBER_FORMATS.map(f => (
                      <div key={f.type} className={`p-2 rounded border flex items-center justify-between ${selectedSandboxJobType === f.type ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-white border-slate-150 text-slate-600'}`}>
                        <span>{f.prefix}</span>
                        <code className="text-slate-800">{f.sample}</code>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Underlying PL/pgSQL DDL Engine Code */}
              <div className="lg:col-span-7 bg-[#0D1B2A] rounded-xl border border-slate-800 shadow-md p-6 flex flex-col h-[650px]">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-xs font-mono font-bold text-white uppercase">
                        public.generate_job_number(VARCHAR)
                      </h3>
                      <p className="text-[10px] text-slate-400">PL/pgSQL Atomic Sequence Dispatch Logic</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyText(JOB_NUMBER_PLPGSQL)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold rounded text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Code Copied" : "Copy PL/pgSQL"}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-lg border border-slate-800/80 font-mono text-[11px] leading-relaxed text-slate-300">
                  <pre className="whitespace-pre-wrap">{JOB_NUMBER_PLPGSQL}</pre>
                </div>
              </div>

            </div>
          )}

          {/* SUB-TAB 3: COMPLETE SUPABASE SQL DDL & RLS POLICIES */}
          {v2SubTab === 'DDL' && (
            <div className="bg-[#0D1B2A] rounded-xl border border-slate-800 shadow-md p-6 flex flex-col h-[750px] text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                      Complete Supabase PostgreSQL V2 Production DDL (Parts 1 - 12)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Includes ENUMs, Master Jobs, Assignments, Territories, Workflows, SLAs, Doc Tracking, Parts Orders, Likert Feedback, KPI Weightages, Notification Rules, up-to-date Instruments Fleet, and Workshop Receiving.
                  </p>
                </div>

                <button
                  onClick={() => handleCopyText(SUPABASE_SQL_V2, true)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-mono font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all shrink-0"
                >
                  {sqlCopied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                  {sqlCopied ? "Complete DDL Copied!" : "Copy Production DDL (1000+ Lines)"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-950 p-5 rounded-lg border border-slate-800 font-mono text-[11px] leading-relaxed text-emerald-300/90 selection:bg-emerald-500 selection:text-slate-950">
                <pre className="whitespace-pre-wrap">{SUPABASE_SQL_V2}</pre>
              </div>
            </div>
          )}

          {/* SUB-TAB 4: 12 ENTERPRISE ENGINES SPECIFICATIONS */}
          {v2SubTab === 'ENGINES' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
              
              {/* Left List of 12 Engines */}
              <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 max-h-[700px] overflow-y-auto">
                <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider px-2 pb-2 border-b">
                  🏢 V2 Operational Domains (12 Engines)
                </h3>

                {V2_ENGINE_BREAKDOWN.map((eng, eIdx) => (
                  <button
                    key={eng.part}
                    onClick={() => setActiveEngineIndex(eIdx)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                      activeEngineIndex === eIdx 
                        ? 'bg-blue-50 border-[#0054A6] shadow-sm' 
                        : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${activeEngineIndex === eIdx ? 'text-[#0054A6]' : 'text-slate-400'}`}>
                        {eng.part}
                      </span>
                      <h4 className={`text-xs font-bold mt-0.5 ${activeEngineIndex === eIdx ? 'text-blue-950 font-extrabold' : 'text-slate-800'}`}>
                        {eng.title}
                      </h4>
                      <code className="text-[10px] text-slate-500 font-mono">{eng.table}</code>
                    </div>
                    <ChevronRight className={`w-4 h-4 mt-2 ${activeEngineIndex === eIdx ? 'text-[#0054A6]' : 'text-slate-400'}`} />
                  </button>
                ))}
              </div>

              {/* Right Engine Deep Dive Card */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-2 py-0.5 rounded uppercase">
                      {V2_ENGINE_BREAKDOWN[activeEngineIndex].part} Specification
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 font-sans mt-1">
                      {V2_ENGINE_BREAKDOWN[activeEngineIndex].title}
                    </h3>
                    <code className="text-xs text-[#0054A6] font-mono font-bold">
                      {V2_ENGINE_BREAKDOWN[activeEngineIndex].table}
                    </code>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                    <Wrench className="w-6 h-6 stroke-[1.8]" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {V2_ENGINE_BREAKDOWN[activeEngineIndex].desc}
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider">
                    🔑 Primary Defined Fields & Foreign Keys:
                  </h4>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {V2_ENGINE_BREAKDOWN[activeEngineIndex].keyFields.map(f => (
                      <span key={f} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-250 font-semibold">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Simulated Feature Sandbox */}
                <div className="p-5 bg-gradient-to-br from-slate-900 to-[#0D1B2A] rounded-xl border border-slate-800 text-white space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                    <Play className="w-4 h-4 fill-current" /> Live Architectural Feature Capability
                  </div>
                  
                  {activeEngineIndex === 0 && (
                    <p className="text-xs text-slate-300 font-mono">
                      [MASTER DISPATCH]: Querying job <code className="text-amber-400">INS-2026-00001</code> joins 12 tables in &lt;1.2ms via Supabase compound UUID index.
                    </p>
                  )}
                  {activeEngineIndex === 1 && (
                    <p className="text-xs text-slate-300 font-mono">
                      [ROSTER ASSIGN]: Eng. Suresh Perera (Area Eng) and Eng. Nimani (Bench Specialist) assigned concurrently. Both receive mobile push notifications.
                    </p>
                  )}
                  {activeEngineIndex === 6 && (
                    <p className="text-xs text-slate-300 font-mono">
                      [PROCUREMENT INTERCEPT]: Repair SLA timer paused. Parts order <code className="text-emerald-400">PO-SHM-992</code> flagged 'Ordered'. SLA resumes on warehouse check-in.
                    </p>
                  )}
                  {activeEngineIndex === 7 && (
                    <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <QrCode className="w-10 h-10 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-white block">Intelligent QR Likert Generator</span>
                        <span className="text-[10px] text-slate-400 font-mono">Scan on clinician phone to submit 1-5 Likert scores directly to Supabase RLS endpoint.</span>
                      </div>
                    </div>
                  )}
                  {activeEngineIndex === 11 && (
                    <p className="text-xs text-slate-300 font-mono">
                      [WORKSHOP RECEIVING]: Intake logged with photos, NIC credentials <code className="text-amber-400">921029312V</code>, and unboxed spectrophotometer condition report.
                    </p>
                  )}
                  {![0, 1, 6, 7, 11].includes(activeEngineIndex) && (
                    <p className="text-xs text-slate-300 font-mono">
                      [ENTERPRISE ENGINE ACTIVE]: Fully normalized PostgreSQL foreign constraints guaranteed. Zero data anomalies or orphaned records.
                    </p>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ==================================================================================================== */}
      {/* SECTION B: V1 LEGACY SCHEMA REGISTRY WORKSPACE (34 TABLES) */}
      {/* ==================================================================================================== */}
      {schemaVersion === 'V1_LEGACY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[650px]">
            <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-2">
              <h3 className="text-xs font-bold font-mono text-slate-600 uppercase">
                V1 Legacy Tables ({filteredLegacyTables.length})
              </h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter V1 tables..."
                  className="w-full bg-white border border-slate-250 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={tableSearchQuery}
                  onChange={e => setTableSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredLegacyTables.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTableId(t.id)}
                  className={`w-full p-3.5 text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedTableId === t.id ? 'bg-blue-50/80 font-bold text-[#0054A6] border-l-4 border-[#0054A6]' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xs block font-mono">{t.name}</span>
                    <span className="text-[10px] text-slate-400">{t.module}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded">
                  {activeLegacyTable.module} Module
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-mono mt-1">
                  public.{activeLegacyTable.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{activeLegacyTable.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold font-mono text-slate-700 uppercase">Columns Specification:</h4>
              <div className="border rounded-xl overflow-hidden divide-y divide-slate-100 text-xs font-mono">
                {activeLegacyTable.columns.map(c => (
                  <div key={c.name} className="p-3 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      {c.isPrimary && <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      <span className="font-bold text-slate-800">{c.name}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">{c.type}</span>
                    </div>
                    <div className="text-right">
                      {c.references && <span className="text-[10px] text-purple-700 font-bold mr-2">→ FK: {c.references}</span>}
                      <span className="text-[11px] text-slate-500 font-sans">{c.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
