import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Stethoscope, AlertTriangle, RefreshCw } from 'lucide-react';
import Header from '../../components/layout/Header';
import { sendSymptomMessage, type ChatMessage } from '../../api/chat';

const WELCOME: ChatMessage = {
  role: 'assistant',
  content: `Namaste! Main hoon **SehatKosh AI**, aapka personal health assistant. 🏥

Main aapke symptoms samajhne mein aur sahi kadam uthane mein madad kar sakta hoon.

**Aap mujhe kuch bhi bata sakte hain jaise:**
- "Mujhe 2 din se bukhaar hai"
- "My stomach has been hurting since morning"
- "Sir dard ho raha hai aur chakkar aa rahe hain"

*Note: Main sirf samanya swasthya jaankari deta hoon. Diagnosis aur treatment ke liye hamesha ek qualified doctor se milein.*

**Apne symptoms batayein / Describe your symptoms:**`,
};

function formatText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    line = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return <li key={i} dangerouslySetInnerHTML={{ __html: line.replace(/^[-•]\s/, '') }} style={{ marginLeft: '16px', marginBottom: '2px' }} />;
    }
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} dangerouslySetInnerHTML={{ __html: line }} style={{ marginBottom: '4px' }} />;
  });
}

function isEmergencyKeyword(text: string) {
  const keywords = ['chest pain', 'seene mein dard', 'can\'t breathe', 'saans nahi', 'unconscious', 'behosh', 'stroke', 'paralysis', 'heart attack', 'seizure', 'mirgi', 'dil ka daura', 'dum ghut'];
  return keywords.some((k) => text.toLowerCase().includes(k));
}

export default function SymptomChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages.filter((m) => m !== WELCOME), userMsg];

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendSymptomMessage(updatedMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
      const serverMsg = axiosErr?.response?.data?.message;
      const status = axiosErr?.response?.status;

      let errorContent = '❌ **Connection Error**\n\nCould not reach the AI service. Please check:\n- Backend server is running\n- Try again in a moment';

      if (status === 401) {
        errorContent = '🔒 **Session Expired**\n\nPlease log in again.';
      } else if (serverMsg) {
        errorContent = `❌ **Error**\n\n${serverMsg}`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: errorContent }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    setInput('');
    inputRef.current?.focus();
  };

  const quickSymptoms = ['Bukhaar (Fever)', 'Sir Dard (Headache)', 'Pait Dard (Stomach Pain)', 'Khansi (Cough)', 'Thakaan (Fatigue)', 'Ulti / Matli (Nausea)', 'Dengue ke symptoms', 'Typhoid'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: '#f8fafc', overflow: 'hidden' }}>
      <Header title="Symptom Checker" subtitle="AI-powered health guidance — not a substitute for medical advice" />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '20px', gap: '20px' }}>

        {/* Chat Area */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: 'white', borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid rgba(226,232,240,0.8)',
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #064e3b, #065f46)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={22} color="white" />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>SehatKosh AI</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>Online · Medical Assistant</p>
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              title="Clear chat"
              style={{
                background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
                borderRadius: '8px', padding: '7px', color: 'rgba(255,255,255,0.7)',
                display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px',
              }}
            >
              <RefreshCw size={14} color="rgba(255,255,255,0.8)" />
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>New Chat</span>
            </button>
          </div>

          {/* Messages */}
          <div ref={messagesRef} style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, idx) => {
              const isBot = msg.role === 'assistant';
              const emergency = !isBot && isEmergencyKeyword(msg.content);
              return (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: isBot ? 'row' : 'row-reverse' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                    background: isBot ? 'linear-gradient(135deg,#064e3b,#059669)' : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isBot ? <Bot size={16} color="white" /> : <User size={16} color="white" />}
                  </div>

                  {/* Bubble */}
                  <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: isBot ? 'flex-start' : 'flex-end' }}>
                    {emergency && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px', padding: '6px 10px', marginBottom: '4px',
                        fontSize: '11px', color: '#dc2626', fontWeight: '600',
                      }}>
                        <AlertTriangle size={12} /> Yeh gambhir lag raha hai — turant 112 call karein ya najdiki hospital jayein!
                      </div>
                    )}
                    <div style={{
                      padding: '12px 16px', borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                      background: isBot ? '#f8fafc' : 'linear-gradient(135deg,#10b981,#059669)',
                      color: isBot ? '#1e293b' : 'white',
                      fontSize: '13px', lineHeight: 1.7,
                      border: isBot ? '1px solid #f1f5f9' : 'none',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}>
                      {formatText(msg.content)}
                    </div>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {loading && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg,#064e3b,#059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Bot size={16} color="white" />
                </div>
                <div style={{
                  padding: '14px 18px', borderRadius: '4px 16px 16px 16px',
                  background: '#f8fafc', border: '1px solid #f1f5f9',
                  display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{
                      width: '7px', height: '7px', borderRadius: '50%', background: '#10b981',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'center',
              background: 'white', border: '1.5px solid #e2e8f0',
              borderRadius: '14px', padding: '10px 14px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'border-color 0.15s',
            }}
              onFocus={() => {}}
            >
              <Stethoscope size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Apne symptoms batayein... (Hindi ya English mein)"
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontSize: '13px', color: '#1e293b',
                }}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                style={{
                  width: '34px', height: '34px', borderRadius: '10px', border: 'none',
                  background: input.trim() && !loading ? 'linear-gradient(135deg,#10b981,#059669)' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  transition: 'all 0.15s', flexShrink: 0,
                  boxShadow: input.trim() && !loading ? '0 3px 8px rgba(16,185,129,0.4)' : 'none',
                }}
              >
                <Send size={14} color={input.trim() && !loading ? 'white' : '#94a3b8'} />
              </button>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '8px' }}>
              Enter dabayein bhejne ke liye &nbsp;·&nbsp; Yeh AI guidance hai, medical diagnosis nahi
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0, overflowY: 'auto', paddingBottom: '4px' }}>

          {/* Quick Symptoms */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
          }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Quick Symptoms</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {quickSymptoms.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  style={{
                    padding: '8px 12px', borderRadius: '9px', border: '1px solid #e2e8f0',
                    background: '#f8fafc', cursor: 'pointer', fontSize: '12px',
                    color: '#475569', fontWeight: '500', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.06)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(16,185,129,0.3)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#065f46';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0';
                    (e.currentTarget as HTMLButtonElement).style.color = '#475569';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{
            background: 'rgba(245,158,11,0.06)', borderRadius: '16px', padding: '16px',
            border: '1px solid rgba(245,158,11,0.2)',
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#92400e' }}>Disclaimer</p>
            </div>
            <p style={{ fontSize: '11px', color: '#78350f', lineHeight: 1.6 }}>
              SehatKosh AI sirf samanya swasthya jaankari deta hai. Yeh professional medical advice ki jagah nahi le sakta.
            </p>
            <p style={{ fontSize: '11px', color: '#92400e', marginTop: '8px', fontWeight: '600' }}>
              Emergency mein: 112 (Police/Ambulance) ya 108 (Ambulance) call karein.
            </p>
          </div>

          {/* Tips */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)',
          }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Tips for better results</p>
            {[
              'Mention how long you\'ve had symptoms',
              'Describe severity (mild/moderate/severe)',
              'Mention any medicines you\'re taking',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                <span style={{
                  width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#10b981,#059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: '800', color: 'white',
                }}>{i + 1}</span>
                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
