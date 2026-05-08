import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Header from '../../components/layout/Header';
import { getPatients } from '../../api/patients';
import type { Patient } from '../../types';

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header title="Patients" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-3 font-medium text-slate-500">Name</th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500">Email</th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500">Blood Group</th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500">Phone</th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500">Gender</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient) => (
                  <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
                          {patient.fullName.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{patient.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{patient.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                        {patient.bloodGroup || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{patient.phoneNumber}</td>
                    <td className="px-6 py-4 text-slate-500">{patient.gender}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400">No patients found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
