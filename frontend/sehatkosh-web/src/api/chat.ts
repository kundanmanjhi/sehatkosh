import api from './axios';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendSymptomMessage(messages: ChatMessage[]): Promise<string> {
  const res = await api.post<{ reply: string }>('/chat/symptoms', { messages });
  return res.data.reply;
}
