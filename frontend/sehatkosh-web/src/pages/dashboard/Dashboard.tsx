import { useEffect, useState } from 'react';
import { Users, Stethoscope, Calendar, Activity } from 'lucide-react';
import Header from '../../components/layout/Header';
import StatCard from '../../components/ui/StatCard';
import { getDoctors } from '../../api/doctors';
import { getPatients } from '../../api/patients';
import { useAuthStore } from '../../store/authStore';
import type { Doctor, Patient } from '../../types';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    getDoctors().then(setDoctors).catch(() => {});
    if (user?.role === 'Admin' || user?.role === 'Doctor') {
      getPatients().then(setPatients).catch(() => {});
    }
  }, [user]);

  const stats = [
    { title: 'Total Patients', value: patients.length || '--', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Doctors', value: doctors.length, icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Appointments Today', value: 0, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Available Doctors', value: doctors.filter((d) => d.isAvailable).length, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-700">
            Welcome back, {user?.fullName}
          </h2>
          <p className="text-slate-500 text-sm">Here's an overview of SehatKosh today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-700 mb-4">Available Doctors</h3>
            <div className="space-y-3">
              {doctors.filter((d) => d.isAvailable).slice(0, 5).map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{doctor.fullName}</p>
                    <p className="text-xs text-slate-500">{doctor.specialization}</p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">Available</span>
                </div>
              ))}
              {doctors.filter((d) => d.isAvailable).length === 0 && (
                <p className="text-slate-400 text-sm text-center py-4">No doctors available</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-700 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Book Appointment', to: '/appointments', color: 'bg-emerald-600 text-white' },
                { label: 'Find a Doctor', to: '/doctors', color: 'bg-blue-600 text-white' },
                { label: 'My Records', to: '/patients/me', color: 'bg-violet-600 text-white' },
                { label: 'View Schedule', to: '/appointments', color: 'bg-orange-500 text-white' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.to}
                  className={`${action.color} rounded-lg px-4 py-3 text-sm font-medium text-center hover:opacity-90 transition-opacity`}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
