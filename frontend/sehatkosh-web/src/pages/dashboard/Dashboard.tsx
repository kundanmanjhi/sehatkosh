import { useEffect, useState } from 'react';
import {
  Users, Stethoscope, Calendar, Activity, ArrowRight,
  TrendingUp, ClipboardList, Clock, Star, ChevronRight,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import { getDoctors } from '../../api/doctors';
import { getPatients } from '../../api/patients';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import type { Doctor, Patient } from '../../types';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Namaste 🙏';
  if (h < 17) return 'Namaste 🙏';
  return 'Namaste 🙏';
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    getDoctors().then(setDoctors).catch(() => {});
    if (user?.role === 'Admin' || user?.role === 'Doctor') {
      getPatients().then(setPatients).catch(() => {});
    }
  }, [user]);

  const availableDoctors = doctors.filter((d) => d.isAvailable);

  const stats = [
    {
      title: 'Total Patients',
      value: user?.role === 'Patient' ? '--' : patients.length,
      icon: Users,
      gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      lightBg: 'rgba(59,130,246,0.08)',
      change: '+12%',
      changeColor: '#22c55e',
    },
    {
      title: 'Total Doctors',
      value: doctors.length,
      icon: Stethoscope,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      lightBg: 'rgba(16,185,129,0.08)',
      change: '+3%',
      changeColor: '#22c55e',
    },
    {
      title: 'Appointments Today',
      value: 0,
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      lightBg: 'rgba(139,92,246,0.08)',
      change: '0 new',
      changeColor: '#94a3b8',
    },
    {
      title: 'Available Doctors',
      value: availableDoctors.length,
      icon: Activity,
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      lightBg: 'rgba(245,158,11,0.08)',
      change: 'Now online',
      changeColor: '#22c55e',
    },
  ];

  const quickActions = [
    { label: 'Book Appointment', desc: 'Schedule with a doctor', icon: Calendar, to: '/appointments', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { label: 'Find a Doctor', desc: 'Browse specialists', icon: Stethoscope, to: '/doctors', gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
    { label: 'My Records', desc: 'View health history', icon: ClipboardList, to: '/patients/me', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { label: 'View Schedule', desc: 'Upcoming appointments', icon: Clock, to: '/appointments', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  ];

  const tips = [
    { tip: 'Drink 8 glasses of water daily to stay hydrated.', icon: '💧' },
    { tip: 'Get 7–8 hours of sleep for optimal recovery.', icon: '😴' },
    { tip: 'Walk 10,000 steps daily to improve heart health.', icon: '🚶' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc', overflow: 'auto' }}>
      <Header title="Dashboard" subtitle="Overview of SehatKosh" />

      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Welcome Banner */}
        <div style={{
          borderRadius: '20px', padding: '32px 36px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        }}>
          {/* Decorative circles — kept on left so they don't hit the date card */}
          <div style={{
            position: 'absolute', top: '-50px', left: '-30px', width: '200px', height: '200px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-70px', left: '120px', width: '240px', height: '240px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <div>
              {/* Role badge — inline, not absolute */}
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.35)',
                borderRadius: '20px', padding: '3px 12px', marginBottom: '10px',
              }}>
                <span style={{ color: '#6ee7b7', fontSize: '11px', fontWeight: '700' }}>{user?.role}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', marginBottom: '4px' }}>
                {getGreeting()}
              </p>
              <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                {user?.fullName}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', maxWidth: '400px', lineHeight: 1.6 }}>
                Here's what's happening in SehatKosh today. Stay on top of your health journey.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
              borderRadius: '16px', padding: '20px 28px', textAlign: 'center', flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', marginBottom: '4px' }}>Today</p>
              <p style={{ color: 'white', fontSize: '22px', fontWeight: '700' }}>
                {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', marginTop: '2px' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {stats.map((stat) => (
            <div key={stat.title} style={{
              background: 'white', borderRadius: '16px', padding: '22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
              border: '1px solid rgba(226,232,240,0.8)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: stat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}>
                  <stat.icon size={20} color="white" />
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: stat.lightBg, borderRadius: '20px', padding: '3px 10px',
                }}>
                  <TrendingUp size={11} color={stat.changeColor} />
                  <span style={{ fontSize: '11px', fontWeight: '600', color: stat.changeColor }}>{stat.change}</span>
                </div>
              </div>
              <p style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Middle Row: Available Doctors + Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>

          {/* Available Doctors */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Available Doctors</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Ready to consult right now</p>
              </div>
              <button
                onClick={() => navigate('/doctors')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '12px', fontWeight: '600', color: '#059669',
                  background: 'rgba(16,185,129,0.08)', border: 'none',
                  borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                }}
              >
                View all <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {availableDoctors.slice(0, 4).map((doctor) => (
                <div key={doctor.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: '12px', background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6ee7b7, #059669)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', fontSize: '15px', color: 'white', flexShrink: 0,
                    }}>
                      {doctor.fullName?.charAt(0) ?? 'D'}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{doctor.fullName}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>{doctor.specialization || 'General Physician'}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={11} fill="#fbbf24" color="#fbbf24" />
                      <span style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>4.9</span>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: '600', color: '#059669',
                      background: 'rgba(16,185,129,0.1)', borderRadius: '20px', padding: '3px 10px',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                      Available
                    </span>
                  </div>
                </div>
              ))}
              {availableDoctors.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' }}>
                  <Stethoscope size={32} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
                  No doctors available right now
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Quick Actions</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Common tasks at a glance</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.to)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: '#f8fafc', transition: 'all 0.15s', textAlign: 'left', width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: action.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.15)', flexShrink: 0,
                    }}>
                      <action.icon size={17} color="white" />
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{action.label}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>{action.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#cbd5e1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
        }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Daily Health Tips</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Small habits, big results</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {tips.map((t, i) => (
              <div key={i} style={{
                padding: '16px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                border: '1px solid rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'flex-start', gap: '12px',
              }}>
                <span style={{ fontSize: '22px', lineHeight: 1 }}>{t.icon}</span>
                <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>{t.tip}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
