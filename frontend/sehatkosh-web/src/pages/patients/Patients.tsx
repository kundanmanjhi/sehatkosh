import { useEffect, useState } from 'react';
import { Search, Users, Mail, Phone, MapPin, Droplets } from 'lucide-react';
import Header from '../../components/layout/Header';
import { getPatients } from '../../api/patients';
import type { Patient } from '../../types';

const bloodGroupColors: Record<string, string> = {
  'A+': 'linear-gradient(135deg,#ef4444,#f87171)',
  'A-': 'linear-gradient(135deg,#f97316,#fb923c)',
  'B+': 'linear-gradient(135deg,#3b82f6,#60a5fa)',
  'B-': 'linear-gradient(135deg,#6366f1,#818cf8)',
  'O+': 'linear-gradient(135deg,#10b981,#34d399)',
  'O-': 'linear-gradient(135deg,#059669,#10b981)',
  'AB+': 'linear-gradient(135deg,#8b5cf6,#a78bfa)',
  'AB-': 'linear-gradient(135deg,#ec4899,#f472b6)',
};

const avatarGradients = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

type ViewMode = 'cards' | 'table';

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  useEffect(() => {
    getPatients().then(setPatients).finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const genders = ['Male', 'Female', 'Other'];
  const genderCount = (g: string) => patients.filter((p) => p.gender?.toLowerCase() === g.toLowerCase()).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc', overflow: 'auto' }}>
      <Header title="Patients" subtitle="Manage patient records and information" />

      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0,
            }}>
              <Users size={22} color="white" />
            </div>
            <div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{patients.length}</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Total Patients</p>
            </div>
          </div>
          {genders.map((g, i) => (
            <div key={g} style={{
              background: 'white', borderRadius: '16px', padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
            }}>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{genderCount(g)}</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{g}</p>
              <div style={{
                marginTop: '10px', height: '4px', borderRadius: '4px',
                background: '#f1f5f9', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: '4px',
                  background: ['linear-gradient(90deg,#3b82f6,#6366f1)', 'linear-gradient(90deg,#ec4899,#f43f5e)', 'linear-gradient(90deg,#10b981,#059669)'][i],
                  width: patients.length ? `${(genderCount(g) / patients.length) * 100}%` : '0%',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Search + View Toggle */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '16px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
            padding: '10px 16px', flex: 1, maxWidth: '380px',
          }}>
            <Search size={16} color="#94a3b8" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients by name or email..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#475569', width: '100%' }}
            />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
            {(['cards', 'table'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '6px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: '600', transition: 'all 0.15s',
                  background: viewMode === mode ? 'white' : 'transparent',
                  color: viewMode === mode ? '#0f172a' : '#94a3b8',
                  boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  textTransform: 'capitalize',
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          <span style={{
            fontSize: '12px', fontWeight: '600', color: '#94a3b8',
            background: '#f1f5f9', borderRadius: '20px', padding: '4px 12px',
          }}>
            {filtered.length} results
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#94a3b8', fontSize: '14px' }}>Loading patients...</div>
        ) : viewMode === 'cards' ? (
          // Card Grid
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {filtered.map((patient, idx) => {
              const bg = avatarGradients[idx % avatarGradients.length];
              const bgGradient = bloodGroupColors[patient.bloodGroup] ?? 'linear-gradient(135deg,#94a3b8,#64748b)';
              return (
                <div key={patient.id} style={{
                  background: 'white', borderRadius: '18px', overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Top Strip */}
                  <div style={{ height: '6px', background: bg }} />

                  <div style={{ padding: '20px' }}>
                    {/* Avatar + Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '50%', background: bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px', fontWeight: '800', color: 'white', flexShrink: 0,
                      }}>
                        {patient.fullName.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{patient.fullName}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                          {patient.gender || 'Gender N/A'}
                          {patient.dateOfBirth && patient.dateOfBirth !== '0001-01-01T00:00:00Z'
                            ? ` · ${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}y`
                            : ''}
                        </p>
                      </div>
                      {patient.bloodGroup && (
                        <div style={{
                          marginLeft: 'auto', flexShrink: 0,
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: bgGradient,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: '800', color: 'white',
                        }}>
                          {patient.bloodGroup}
                        </div>
                      )}
                    </div>

                    {/* Info rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={13} color="#94a3b8" />
                        <span style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.email}</span>
                      </div>
                      {patient.phoneNumber && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Phone size={13} color="#94a3b8" />
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{patient.phoneNumber}</span>
                        </div>
                      )}
                      {patient.address && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin size={13} color="#94a3b8" />
                          <span style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.address}</span>
                        </div>
                      )}
                      {patient.allergies && (
                        <div style={{
                          marginTop: '4px', background: 'rgba(239,68,68,0.06)', borderRadius: '8px',
                          padding: '6px 10px', fontSize: '12px', color: '#dc2626',
                          border: '1px solid rgba(239,68,68,0.12)',
                        }}>
                          <span style={{ fontWeight: '600' }}>Allergies: </span>{patient.allergies}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: '#94a3b8', fontSize: '14px' }}>
                No patients found.
              </div>
            )}
          </div>
        ) : (
          // Table View
          <div style={{
            background: 'white', borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Patient', 'Email', 'Blood Group', 'Phone', 'Gender', 'Address'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 20px', textAlign: 'left',
                      fontSize: '11px', fontWeight: '700', color: '#94a3b8',
                      letterSpacing: '0.5px', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient, idx) => {
                  const bg = avatarGradients[idx % avatarGradients.length];
                  const bgGradient = bloodGroupColors[patient.bloodGroup] ?? 'linear-gradient(135deg,#94a3b8,#64748b)';
                  return (
                    <tr key={patient.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'white'; }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px', height: '34px', borderRadius: '50%', background: bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '13px', fontWeight: '800', color: 'white', flexShrink: 0,
                          }}>
                            {patient.fullName.charAt(0)}
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{patient.fullName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b' }}>{patient.email}</td>
                      <td style={{ padding: '14px 20px' }}>
                        {patient.bloodGroup ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            background: bgGradient, color: 'white',
                            borderRadius: '20px', padding: '3px 10px',
                            fontSize: '11px', fontWeight: '800',
                          }}>
                            <Droplets size={10} />
                            {patient.bloodGroup}
                          </span>
                        ) : (
                          <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b' }}>{patient.phoneNumber || '—'}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          fontSize: '12px', fontWeight: '600',
                          color: patient.gender ? '#475569' : '#cbd5e1',
                          background: patient.gender ? '#f1f5f9' : 'transparent',
                          borderRadius: '20px', padding: patient.gender ? '3px 10px' : '0',
                        }}>
                          {patient.gender || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {patient.address || '—'}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                      No patients found.
                    </td>
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
