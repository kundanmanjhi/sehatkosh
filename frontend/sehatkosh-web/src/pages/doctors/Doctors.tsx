import { useEffect, useState } from 'react';
import { Search, Stethoscope } from 'lucide-react';
import Header from '../../components/layout/Header';
import { getDoctors } from '../../api/doctors';
import type { Doctor } from '../../types';

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter(
    (d) =>
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header title="Doctors" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialization..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                      {doctor.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{doctor.fullName}</p>
                      <p className="text-xs text-slate-500">{doctor.specialization}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${doctor.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {doctor.isAvailable ? 'Available' : 'Busy'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Stethoscope size={14} />
                    {doctor.experienceYears} years experience
                  </div>
                  {doctor.qualifications && (
                    <p className="text-xs truncate">{doctor.qualifications}</p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    Rs. {doctor.consultationFee.toLocaleString()}
                  </span>
                  <button className="text-sm text-emerald-600 font-medium hover:underline">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-400">No doctors found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
