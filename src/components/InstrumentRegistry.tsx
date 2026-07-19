import React, { useState } from 'react';
import { InstrumentAsset } from '../types';
import { Search, Plus, Filter, ShieldAlert, BadgeDollarSign, Settings, Layers, Calendar } from 'lucide-react';

interface InstrumentRegistryProps {
  assets: InstrumentAsset[];
  onAddAsset: (asset: InstrumentAsset) => void;
}

export default function InstrumentRegistry({ assets, onAddAsset }: InstrumentRegistryProps) {
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [customer, setCustomer] = useState('');
  const [dept, setDept] = useState('');
  const [value, setValue] = useState('');
  const [warranty, setWarranty] = useState('24');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !serial || !customer) return;

    const newAsset: InstrumentAsset = {
      id: `ast_${Date.now().toString().substring(8)}`,
      assetNumber: `AV-AST-2026-${Math.floor(100 + Math.random() * 900)}`,
      serialNumber: serial,
      brand,
      model,
      description: `${brand} high-fidelity scientific analyzer system`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceValue: parseFloat(value) || 5000000,
      warrantyPeriodMonths: parseInt(warranty) || 24,
      installationDate: new Date().toISOString().split('T')[0],
      customerName: customer,
      department: dept || 'Main Laboratory',
      nextServiceInterval: '6 Months',
      nextServiceDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amcStatus: 'None',
      serviceHistoryCount: 0,
      repairHistoryCount: 0,
      totalRevenueGenerated: 0
    };

    onAddAsset(newAsset);
    setShowAddForm(false);
    setBrand('');
    setModel('');
    setSerial('');
    setCustomer('');
    setDept('');
    setValue('');
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = 
      a.brand.toLowerCase().includes(search.toLowerCase()) ||
      a.model.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.customerName.toLowerCase().includes(search.toLowerCase());
    
    const matchesBrand = filterBrand === 'All' || a.brand === filterBrand;

    return matchesSearch && matchesBrand;
  });

  const brands = Array.from(new Set(assets.map(a => a.brand)));

  return (
    <div id="instrument_registry_panel" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Instrument Registry</h1>
          <p className="text-sm text-slate-500">Asset lifecycle tracking, calibration audits, and AMC contracts management</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus className="w-5 h-5" /> {showAddForm ? 'Close Portal' : 'Register Asset'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm uppercase">Inbound Asset Registration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Brand Name *</label>
              <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full border p-2 rounded text-sm" placeholder="Sysmex" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Model *</label>
              <input type="text" value={model} onChange={e => setModel(e.target.value)} className="w-full border p-2 rounded text-sm" placeholder="XN-550" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Serial Number *</label>
              <input type="text" value={serial} onChange={e => setSerial(e.target.value)} className="w-full border p-2 rounded text-sm" placeholder="SN-92011" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Warranty (Months)</label>
              <input type="number" value={warranty} onChange={e => setWarranty(e.target.value)} className="w-full border p-2 rounded text-sm" placeholder="24" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Customer Location *</label>
              <input type="text" value={customer} onChange={e => setCustomer(e.target.value)} className="w-full border p-2 rounded text-sm" placeholder="Nawaloka Hospitals" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Department / Unit</label>
              <input type="text" value={dept} onChange={e => setDept(e.target.value)} className="w-full border p-2 rounded text-sm" placeholder="ICU Unit 2" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Valuation Value (LKR)</label>
              <input type="number" value={value} onChange={e => setValue(e.target.value)} className="w-full border p-2 rounded text-sm" placeholder="4500000" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setShowAddForm(false)} className="bg-slate-100 px-4 py-2 rounded text-sm font-bold">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-bold shadow-md cursor-pointer">Verify & Save Asset</button>
          </div>
        </form>
      )}

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search brand, model, serial, customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm"
          />
        </div>

        <div>
          <select
            value={filterBrand}
            onChange={e => setFilterBrand(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
          >
            <option value="All">All Brands</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {asset.assetNumber}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">S/N: {asset.serialNumber}</span>
              </div>

              <h3 className="font-extrabold text-slate-800 text-lg">{asset.brand} {asset.model}</h3>
              <p className="text-xs text-slate-500 mt-1">{asset.description}</p>

              <div className="mt-4 pt-4 border-t border-slate-50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Station:</span>
                  <span className="font-bold text-slate-700 text-right truncate max-w-[150px]">{asset.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department Unit:</span>
                  <span className="font-semibold text-slate-700">{asset.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Warranty Active:</span>
                  <span className="font-bold text-emerald-600">{asset.warrantyPeriodMonths} Months</span>
                </div>
                {asset.nextServiceDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Scheduled PM:</span>
                    <span className="font-mono font-bold text-blue-650 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(asset.nextServiceDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Lifetime Revenue:</span>
              <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                LKR {asset.totalRevenueGenerated.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
