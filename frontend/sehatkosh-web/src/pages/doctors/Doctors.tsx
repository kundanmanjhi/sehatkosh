import { useEffect, useState } from 'react';
import { Search, Star, Clock, Phone, Award, CalendarPlus, Users } from 'lucide-react';
import Header from '../../components/layout/Header';
import { getDoctors } from '../../api/doctors';
import type { Doctor } from '../../types';

const specializationColors: Record<string, string> = {
  Cardiology: 'linear-gradient(135deg,#ef4444,#f97316)',
  Neurology: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
  Pediatrics: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
  Orthopedics: 'linear-gradient(135deg,#f59e0b,#ef4444)',
  Dermatology: 'linear-gradient(135deg,#ec4899,#f43f5e)',
  Psychiatry: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
};
const defaultGradient = 'linear-gradient(135deg,#10b981,#059669)';

const getGradient = (spec: string) =>
  Object.entries(specializationColors).find(([k]) =>
    spec?.toLowerCase().includes(k.toLowerCase())
  )?.[1] ?? defaultGradient;

type FilterTab = 'All' | 'Available' | 'Busy';

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  useEffect(() => {
    getDoctors().then(setDoctors).finally(() => setLoading(false));
  }, []);

  const filtered = doctors
    .filter((d) =>
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
    )
    .filter((d) => activeTab === 'All' ? true : activeTab === 'Available' ? d.isAvailable : !d.isAvailable);

  const available = doctors.filter((d) => d.isAvailable).length;

  const tabs: FilterTab[] = ['All', 'Available', 'Busy'];
  const tabCount: Record<FilterTab, number> = {
    All: doctors.length,
    Available: available,
    Busy: doctors.length - available,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc', overflow: 'auto' }}>
      <Header title="Doctors" subtitle="Find and book appointments with specialists" />

      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total Doctors', value: doctors.length, icon: Users, gradient: 'linear-gradient(135deg,#10b981,#059669)' },
            { label: 'Available Now', value: available, icon: Award, gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
            { label: 'Avg. Experience', value: doctors.length ? `${Math.round(doctors.reduce((s, d) => s + d.experienceYears, 0) / doctors.length)}y` : '0y', icon: Clock, gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'white', borderRadius: '16px', padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', background: s.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0,
              }}>
                <s.icon size={22} color="white" />
              </div>
              <div>
                <p style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Tabs */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
            padding: '10px 16px', flex: 1, maxWidth: '360px',
          }}>
            <Search size={16} color="#94a3b8" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialization..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#475569', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '600', transition: 'all 0.15s',
                  background: activeTab === tab ? 'linear-gradient(135deg,#10b981,#059669)' : '#f1f5f9',
                  color: activeTab === tab ? 'white' : '#64748b',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {tab}
                <span style={{
                  fontSize: '11px', fontWeight: '700',
                  background: activeTab === tab ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: activeTab === tab ? 'white' : '#64748b',
                  borderRadius: '10px', padding: '1px 7px',
                }}>
                  {tabCount[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#94a3b8', fontSize: '14px' }}>Loading doctors...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {filtered.map((doctor) => {
              const gradient = getGradient(doctor.specialization);
              return (
                <div key={doctor.id} style={{
                  background: 'white', borderRadius: '20px', overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                  border: '1px solid rgba(226,232,240,0.8)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Card Top Banner */}
                  <div style={{
                    height: '80px', background: gradient, position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute', bottom: '-28px', left: '20px',
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: gradient, border: '3px solid white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '22px', fontWeight: '800', color: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}>
                      {doctor.fullName.charAt(0)}
                    </div>
                    <div style={{
                      position: 'absolute', top: '12px', right: '14px',
                      background: doctor.isAvailable ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.25)',
                      borderRadius: '20px', padding: '4px 12px',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: doctor.isAvailable ? '#10b981' : '#94a3b8',
                        display: 'inline-block',
                      }} />
                      <span style={{
                        fontSize: '11px', fontWeight: '700',
                        color: doctor.isAvailable ? '#065f46' : 'rgba(255,255,255,0.8)',
                      }}>
                        {doctor.isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '36px 20px 20px' }}>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{doctor.fullName}</p>
                    <span style={{
                      display: 'inline-block', marginTop: '4px', marginBottom: '14px',
                      fontSize: '11px', fontWeight: '600', color: 'white',
                      background: gradient, borderRadius: '20px', padding: '3px 10px',
                    }}>
                      {doctor.specialization || 'General Physician'}
                    </span>

                    {/* Rating + Experience */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={12} fill={s <= 4 ? '#fbbf24' : '#e2e8f0'} color={s <= 4 ? '#fbbf24' : '#e2e8f0'} />
                        ))}
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginLeft: '2px' }}>4.8</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                        <Clock size={12} />
                        <span style={{ fontSize: '12px' }}>{doctor.experienceYears}y exp</span>
                      </div>
                    </div>

                    {/* Phone */}
                    {doctor.phoneNumber && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                        <Phone size={12} color="#94a3b8" />
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{doctor.phoneNumber}</span>
                      </div>
                    )}

                    {/* Qualifications */}
                    {doctor.qualifications && (
                      <p style={{
                        fontSize: '12px', color: '#94a3b8', marginBottom: '14px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {doctor.qualifications}
                      </p>
                    )}

                    {/* Fee + Book */}
                    <div style={{
                      borderTop: '1px solid #f1f5f9', paddingTop: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>Consultation Fee</p>
                        <p style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                          Rs. {doctor.consultationFee.toLocaleString()}
                        </p>
                      </div>
                      <button style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '9px 16px', borderRadius: '10px', border: 'none',
                        background: doctor.isAvailable ? gradient : '#f1f5f9',
                        color: doctor.isAvailable ? 'white' : '#94a3b8',
                        fontSize: '12px', fontWeight: '700', cursor: doctor.isAvailable ? 'pointer' : 'default',
                        boxShadow: doctor.isAvailable ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                        transition: 'opacity 0.15s',
                      }}>
                        <CalendarPlus size={13} />
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{
                gridColumn: '1 / -1', textAlign: 'center', padding: '64px',
                color: '#94a3b8', fontSize: '14px',
              }}>
                No doctors found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
