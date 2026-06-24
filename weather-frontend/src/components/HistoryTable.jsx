import React, { useState } from 'react';

export default function HistoryTable({ records, onUpdateNotes, onDeleteRecord, onExport }) {
  const [editingId, setEditingId] = useState(null);
  const [tempNotes, setTempNotes] = useState('');

  const startEditing = (record) => {
    setEditingId(record.id);
    setTempNotes(record.user_notes);
  };

  const handleSave = (id) => {
    onUpdateNotes(id, tempNotes);
    setEditingId(null);
  };

  // Helper function to turn the backend's raw packed string into clean, readable text
  const formatMetrics = (packedString) => {
    if (!packedString) return "N/A";
    
    // If it's a legacy plain string from early database tests, just return it
    if (!packedString.includes('|')) return packedString;

    const [condition, wind, humidity, avgMax] = packedString.split('|');
    
    const getIcon = (cond) => {
      if (cond?.includes("Sunny") || cond?.includes("Clear")) return "☀️";
      if (cond?.includes("Rainy")) return "🌧️";
      if (cond?.includes("Stormy")) return "⚡";
      return "☁️";
    };

    return (
      <div className="space-y-0.5 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-gray-900">
          <span>{getIcon(condition)}</span>
          <span>{condition}</span>
        </div>
        <div className="text-gray-500 text-[11px] grid grid-cols-1 gap-0.5">
          <span>💨 Wind: <b className="text-gray-700">{wind} km/h</b></span>
          <span>💧 Humid: <b className="text-gray-700">{humidity}%</b></span>
          <span>📈 Period Avg Max: <b className="text-blue-600">{avgMax}°C</b></span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
      <div className="sm:flex sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-8xl">Database Logs Dashboard</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Full persistent record-level monitoring with administrative access.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4 flex space-x-2">
          <button
            onClick={() => onExport('json')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm"
          >
            📥 Export JSON
          </button>
          <button
            onClick={() => onExport('csv')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {records.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">No records currently stored in the system registry.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Location (Query / Resolved)</th>
                <th className="px-4 py-3">Date Window</th>
                <th className="px-4 py-3">Live Current Temp</th>
                <th className="px-4 py-3">Atmospheric Metrics</th>
                <th className="px-4 py-3">Operational Notes (Editable)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70 transition align-top">
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-gray-900">{r.resolved_location}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Typed: "{r.location_input}"</div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-500">
                    {r.start_date} <span className="text-gray-300">➔</span> {r.end_date}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-base font-black text-gray-950">{r.temperature_avg}°C</span>
                  </td>
                  <td className="px-4 py-3.5">
                    {formatMetrics(r.weather_condition)}
                  </td>
                  <td className="px-4 py-3.5 max-w-xs">
                    {editingId === r.id ? (
                      <input
                        type="text"
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    ) : (
                      <p className="text-xs text-gray-600 wrap-break-word line-clamp-2" title={r.user_notes}>
                        {r.user_notes || <span className="text-gray-300 italic">No notes added yet</span>}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap text-xs font-medium space-x-2">
                    {editingId === r.id ? (
                      <>
                        <button onClick={() => handleSave(r.id)} className="text-green-600 hover:text-green-900">
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(r)} className="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                        <button onClick={() => onDeleteRecord(r.id)} className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}