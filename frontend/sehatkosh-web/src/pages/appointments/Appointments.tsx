import { useEffect, useState } from 'react';
import { Calendar, Clock, User, Stethoscope, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import { getAppointments, updateAppointmentStatus } from '../../api/appointments';
import { useAuthStore } from '../../store/authStore';
import type { Appointment } from '../../types';

type StatusKey = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

const statusConfig: Record<string, { gradient: string; light: string; color: string; icon: React.FC<{ size: number; color: string }> }> = {
  Pending: {
    gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    light: 'rgba(245,158,11,0.1)',
    color: '#92400e',
    icon: AlertCircle,
  },
  Confirmed: {
    gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    light: 'rgba(59,130,246,0.1)',
    color: '#1e40af',
    icon: CheckCircle,
  },
  Completed: {
    gradient: 'linear-gradient(135deg,#10b981,#059669)',
    light: 'rgba(16,185,129,0.1)',
    color: '#065f46',
    icon: CheckCircle,
  },
  Cancelled: {
    gradient: 'linear-gradient(135deg,#ef4444,#f87171)',
    light: 'rgba(239,68,68,0.1)',
    color: '#991b1b',
    icon: XCircle,
  },
};

export default function Appointments() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StatusKey>('All');

  useEffect(() => {
    getAppointments().then(setAppointments).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const updated = await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch {
      alert('Failed to update status.');
    }
  };

  const tabs: StatusKey[] = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
  const tabCount = (tab: StatusKey) => tab === 'All' ? appointments.length : appointments.filter((a) => a.status === tab).length;

  const filtered = activeTab === 'All' ? appointments : appointments.filter((a) => a.status === activeTab);

  const canAct = user?.role === 'Doctor' || user?.role === 'Admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc', overflow: 'auto' }}>
      <Header title="Appointments" subtitle="Manage and track all appointments" />

      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Status Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {(['Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((status) => {
            const cfg = statusConfig[status];
            const count = appointments.filter((a) => a.status === status).length;
            const Icon = cfg.icon;
            return (
              <div
                key={status}
                onClick={() => setActiveTab(status)}
                style={{
                  background: 'white', borderRadius: '16px', padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: activeTab === status ? `2px solid transparent` : '1px solid rgba(226,232,240,0.8)',
                  backgroundImage: activeTab === status ? `white` : undefined,
                  outline: activeTab === status ? `2px solid #10b981` : 'none',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{count}</p>
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{status}</p>
                  </div>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', background: cfg.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    <Icon size={20} color="white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Tabs + Book Button */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '16px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '7px 14px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: '600', transition: 'all 0.15s',
                  background: activeTab === tab ? 'linear-gradient(135deg,#10b981,#059669)' : '#f1f5f9',
                  color: activeTab === tab ? 'white' : '#64748b',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                {tab}
                <span style={{
                  fontSize: '10px', fontWeight: '700',
                  background: activeTab === tab ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: activeTab === tab ? 'white' : '#64748b',
                  borderRadius: '10px', padding: '1px 6px',
                }}>
                  {tabCount(tab)}
                </span>
              </button>
            ))}
          </div>

          {user?.role === 'Patient' && (
            <button style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white',
              fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
            }}>
              <Plus size={15} />
              Book Appointment
            </button>
          )}
        </div>

        {/* Appointment List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#94a3b8', fontSize: '14px' }}>Loading appointments...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((appt) => {
              const cfg = statusConfig[appt.status] ?? statusConfig.Pending;
              const apptDate = new Date(appt.appointmentDate);
              const Icon = cfg.icon;
              return (
                <div key={appt.id} style={{
                  background: 'white', borderRadius: '16px', overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
                  display: 'flex', transition: 'box-shadow 0.15s',
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
                >
                  {/* Left Date Panel */}
                  <div style={{
                    width: '90px', background: cfg.gradient, display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '20px 10px', flexShrink: 0,
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {apptDate.toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p style={{ color: 'white', fontSize: '32px', fontWeight: '900', lineHeight: 1 }}>
                      {apptDate.getDate()}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px' }}>
                      {apptDate.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                  </div>

                  {/* Body */}
                  <div style={{ flex: 1, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {/* Patient */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'linear-gradient(135deg,#a5f3fc,#0891b2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: '700', color: 'white', flexShrink: 0,
                        }}>
                          {appt.patientName?.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>{appt.patientName}</p>
                          <p style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={10} /> Patient
                          </p>
                        </div>
                      </div>

                      {/* Doctor */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'linear-gradient(135deg,#6ee7b7,#059669)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: '700', color: 'white', flexShrink: 0,
                        }}>
                          {appt.doctorName?.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#334155', lineHeight: 1.2 }}>Dr. {appt.doctorName}</p>
                          <p style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Stethoscope size={10} /> {appt.doctorSpecialization || 'General Physician'}
                          </p>
                        </div>
                      </div>

                      {/* Time + Symptoms */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                          <Clock size={12} color="#94a3b8" /> {appt.timeSlot}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                          <Calendar size={12} color="#94a3b8" />
                          {apptDate.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {appt.symptoms && (
                        <p style={{ fontSize: '12px', color: '#64748b', background: '#f8fafc', borderRadius: '8px', padding: '6px 10px', marginTop: '2px' }}>
                          <span style={{ fontWeight: '600', color: '#475569' }}>Symptoms: </span>{appt.symptoms}
                        </p>
                      )}
                    </div>

                    {/* Right: Status + Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0, marginLeft: '20px' }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: cfg.light, borderRadius: '20px', padding: '5px 12px',
                      }}>
                        <Icon size={13} color={cfg.color} />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: cfg.color }}>{appt.status}</span>
                      </span>

                      {canAct && appt.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleStatusChange(appt.id, 'Confirmed')}
                            style={{
                              padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                              background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: 'white',
                              fontSize: '12px', fontWeight: '700',
                            }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                            style={{
                              padding: '7px 14px', borderRadius: '8px', border: '1px solid #fecaca', cursor: 'pointer',
                              background: 'white', color: '#ef4444',
                              fontSize: '12px', fontWeight: '700',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {canAct && appt.status === 'Confirmed' && (
                        <button
                          onClick={() => handleStatusChange(appt.id, 'Completed')}
                          style={{
                            padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white',
                            fontSize: '12px', fontWeight: '700',
                          }}
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{
                background: 'white', borderRadius: '16px', padding: '64px',
                textAlign: 'center', color: '#94a3b8', fontSize: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
              }}>
                <Calendar size={40} color="#e2e8f0" style={{ margin: '0 auto 12px' }} />
                No appointments found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
