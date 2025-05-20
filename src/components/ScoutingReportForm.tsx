// src/components/ScoutingReportForm.tsx
import React, { useState } from 'react';

interface ScoutingReport {
  user: string;
  report: string;
  date: string;
}

interface Props {
  playerId: number;
  reports: ScoutingReport[];
  setReports: (reports: ScoutingReport[]) => void;
}

const ScoutingReportForm: React.FC<Props> = ({ playerId, reports, setReports }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;

    const newReport: ScoutingReport = {
      user: "Alejandro", // You could replace with actual user context
      report: text.trim(),
      date: new Date().toISOString()
    };

    setReports([...reports, newReport]);
    setText('');
  };

  return (
    <div className="p-4 border rounded-md mt-4">
      <h2 className="text-lg font-semibold mb-2">Add Scouting Report</h2>
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your scouting report..."
      />
      <button
        className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Save
      </button>
      <ul className="mt-4 space-y-2">
        {reports.map((r, i) => (
          <li key={i} className="bg-gray-100 p-2 rounded">
            <strong>{r.user}</strong>: {r.report}
            <br />
            <span className="text-sm text-gray-500">{new Date(r.date).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoutingReportForm;
