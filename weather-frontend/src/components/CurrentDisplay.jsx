import React from 'react';

export default function CurrentDisplay({ weather }) {
  if (!weather) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col justify-center items-center text-center py-12">
        <div className="text-gray-300 text-5xl mb-3">🌍</div>
        <p className="text-gray-500 font-medium text-sm">No destination analyzed yet.</p>
      </div>
    );
  }

  // Unpack string payload securely
  const dataParts = weather.weather_condition ? weather.weather_condition.split('|') : [];
  const displayCondition = dataParts[0] || "Clear";
  const windSpeed = dataParts[1] || "8.0";
  const humidity = dataParts[2] || "35";
  const avgPeriodTemp = dataParts[3] || weather.temperature_avg;
  const rawForecastString = dataParts[4] || "";

  // Dynamic Theme Styling Switch with Low Temperature Thermal Logic Safety Fix
  const getVisualTheme = (cond, currentTemp) => {
    if (currentTemp > 35) return { icon: "🔥", bg: "from-amber-500 to-red-600", card: "⚠️ Excessive Heat Warning" };
    if (cond.includes("Rainy")) return { icon: "🌧️", bg: "from-blue-500 to-indigo-600", card: "🌧️ Rainfall Active" };
    if (cond.includes("Stormy")) return { icon: "⚡", bg: "from-purple-600 to-slate-800", card: "⚡ Storm Advisory" };
    return { icon: "☀️", bg: "from-orange-400 to-amber-500", card: "☀️ Stable Conditions" };
  };

  const theme = getVisualTheme(displayCondition, weather.temperature_avg);

  // Parse out horizontal array
  const forecastDays = rawForecastString ? rawForecastString.split(';').map(item => {
    const [date, maxT, minT, cond] = item.split('=');
    return { date, maxT, minT, cond };
  }) : [];

  // Clean up coordinate text format so Google Maps can process it directly
  let cleanedLocation = weather.resolved_location || "";
  if (cleanedLocation.includes("Lat:") && cleanedLocation.includes("Lon:")) {
    cleanedLocation = cleanedLocation.replace(/Lat:\s*/g, "").replace(/Lon:\s*/g, "");
  }

  const mapQuery = encodeURIComponent(cleanedLocation);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden space-y-4">
      {/* Primary Display Block */}
      <div className={`bg-linear-to-r ${theme.bg} p-5 text-white`}>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded tracking-wide">
              {theme.card}
            </span>
            <h2 className="text-xl font-black mt-1">{weather.resolved_location}</h2>
          </div>
          <div className="text-4xl">{theme.icon}</div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-4xl font-black">{weather.temperature_avg}°C</span>
            <span className="text-xs ml-1 opacity-90">Current Live</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold block">{avgPeriodTemp}°C</span>
            <span className="text-[10px] opacity-75 uppercase font-bold">Period Avg Max</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 px-4 text-center text-xs">
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <p className="text-[9px] text-gray-400 font-bold uppercase">Atmosphere</p>
          <p className="font-bold text-gray-700 mt-0.5 truncate">{displayCondition}</p>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <p className="text-[9px] text-gray-400 font-bold uppercase">Wind Speed</p>
          <p className="font-bold text-gray-700 mt-0.5">{windSpeed} km/h</p>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <p className="text-[9px] text-gray-400 font-bold uppercase">Humidity</p>
          <p className="font-bold text-gray-700 mt-0.5">{humidity}%</p>
        </div>
      </div>

      {/* 5-Day Horizontal Forecast Strip */}
      <div className="px-4">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
          📅 5-Day Period Forecast Trend
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {forecastDays.map((f, idx) => (
            <div key={idx} className="flex-1 min-w-17.5 bg-slate-50 border border-slate-100 p-2 rounded-lg text-center shadow-xs">
              <p className="text-[9px] text-gray-400 font-medium">
                {f.date ? f.date.substring(5) : ''}
              </p>
              <p className="text-xs font-black text-slate-800 mt-0.5">{f.maxT}°C</p>
              <p className="text-[9px] text-slate-400">{f.minT}°C</p>
              <span className="text-[10px] block mt-1">
                {f.cond === 'Sunny' ? '☀️' : f.cond === 'Rainy' ? '🌧️' : '⚡'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Segment */}
      <div className="px-4 pb-4">
        <div className="w-full h-32 rounded-xl overflow-hidden border border-gray-100">
          <iframe title="Location Map" width="100%" height="100%" src={mapUrl} frameBorder="0"></iframe>
        </div>
      </div>
    </div>
  );
}