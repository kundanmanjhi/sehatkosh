import { useEffect, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import Header from '../../components/layout/Header';
import { getAppointments, updateAppointmentStatus } from '../../api/appointments';
import { useAuthStore } from '../../store/authStore';
import type { Appointment } from '../../types';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-50 text-yellow-700',
  Confirmed: 'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-red-50 text-red-700',
};

export default function Appointments() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const updated = await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch {
      alert('Failed to update status.');
    }
  };

  return (
    <div>
      <Header title="Appointments" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-500 text-sm">{appointments.length} total appointments</p>
          {user?.role === 'Patient' && (
            <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
              <Plus size={16} />
              Book Appointment
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                      <Calendar className="text-violet-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{appt.patientName}</p>
                      <p className="text-sm text-slate-500">
                        Dr. {appt.doctorName} · {appt.doctorSpecialization}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(appt.appointmentDate).toLocaleDateString('en-PK', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        })} at {appt.timeSlot}
                      </p>
                      {appt.symptoms && (
                        <p className="text-xs text-slate-500 mt-1">Symptoms: {appt.symptoms}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[appt.status]}`}>
                      {appt.status}
                    </span>
                    {(user?.role === 'Doctor' || user?.role === 'Admin') && appt.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(appt.id, 'Confirmed')}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {(user?.role === 'Doctor' || user?.role === 'Admin') && appt.status === 'Confirmed' && (
                      <button
                        onClick={() => handleStatusChange(appt.id, 'Completed')}
                        className="text-xs text-emerald-600 hover:underline"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="text-center py-12 text-slate-400">No appointments found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
