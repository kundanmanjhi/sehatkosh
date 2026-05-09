import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 28px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '1px' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: '10px', padding: '8px 14px', width: '220px',
        }}>
          <Search size={15} color="#94a3b8" />
          <input
            placeholder="Search..."
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontSize: '13px', color: '#475569', width: '100%',
            }}
          />
        </div>

        {/* Bell */}
        <button style={{
          position: 'relative', width: '38px', height: '38px', borderRadius: '10px',
          background: '#f8fafc', border: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Bell size={17} color="#64748b" />
          <span style={{
            position: 'absolute', top: '8px', right: '8px', width: '7px', height: '7px',
            borderRadius: '50%', background: '#10b981', border: '1.5px solid white',
          }} />
        </button>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6ee7b7, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', fontSize: '15px', color: 'white',
          }}>
            {user?.fullName?.charAt(0) ?? 'U'}
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', lineHeight: 1.2 }}>{user?.fullName}</p>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
