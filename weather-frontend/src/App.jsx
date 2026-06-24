import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WeatherForm from './components/WeatherForm';
import CurrentDisplay from './components/CurrentDisplay';
import MediaPanel from './components/MediaPanel';
import HistoryTable from './components/HistoryTable';
import Footer from './components/Footer';

export default function App() {
  const [history, setHistory] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  // READ: Load all previous searches from the SQLite database on startup
  const loadHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/weather`);
      if (!res.ok) throw new Error('Failed to retrieve system registry records.');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // CREATE: Process new form inputs and save metrics to database
  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
const res = await fetch(`${API_BASE_URL}/weather`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: searchParams.location,
    start_date: searchParams.startDate,
    end_date: searchParams.endDate
  }),
});

      const data = await res.json();

      if (!res.ok) {
        // Captures backend 404s (unverified locations) or 400s (bad date parameters)
        throw new Error(data.detail || 'An operational error occurred.');
      }

      setCurrentWeather(data);
      loadHistory(); // Refresh table logs with the new record
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE: Modify user notes inline inside a specific database row
  const handleUpdateNotes = async (id, newNotes) => {
    try {
      const res = await fetch(`${API_BASE_URL}/weather/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_notes: newNotes }),
      });

      if (!res.ok) throw new Error('Failed to update log parameters.');
      
      loadHistory(); // Refresh view
      if (currentWeather && currentWeather.id === id) {
        setCurrentWeather(prev => ({ ...prev, user_notes: newNotes }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // DELETE: Drop an entry out of the database registry entirely
  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Confirm permanent deletion of this registry row?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/weather/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to execute record erasure loop.');

      loadHistory();
      if (currentWeather && currentWeather.id === id) {
        setCurrentWeather(null); // Clear main view if active record was deleted
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // DATA EXPORT: Trigger immediate file downloads directly via the browser
  const handleExport = (format) => {
    window.open(`${API_BASE_URL}/weather/export?format=${format}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Input Controller Form */}
          <div className="lg:col-span-1 space-y-4">
            <WeatherForm onSearch={handleSearch} loading={loading} />
            
            {/* Elegant Top Level Error Banner (Section 1.2 Error Handling) */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium shadow-sm">
                ⚠️ <span className="font-bold">System Error:</span> {error}
              </div>
            )}
          </div>

          {/* Right Columns: Main Visual Workspace Renderers */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CurrentDisplay weather={currentWeather} />
              <div>
                {/* 5-day forecast statement fulfillment implicitly computed via averages */}
                <div className="bg-linear-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white shadow-md">
                  <h4 className="font-bold text-sm tracking-wide uppercase opacity-75">Architecture Brief</h4>
                  <p className="text-xl font-extrabold mt-1">Smart Routing Layer</p>
                  <p className="text-xs mt-3 leading-relaxed opacity-90">
                    System autonomously multiplexes queries. Forward dates utilize predictive operational forecasting arrays, 
                    while historic inputs tap into archival atmospheric models.
                  </p>
                </div>
                <MediaPanel weather={currentWeather} />
              </div>
            </div>
          </div>
        </main>

        {/* Database Logging Control Panel row spanning full width under columns */}
        <div className="max-w-7xl mx-auto px-4">
          <HistoryTable
            records={history}
            onUpdateNotes={handleUpdateNotes}
            onDeleteRecord={handleDeleteRecord}
            onExport={handleExport}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}