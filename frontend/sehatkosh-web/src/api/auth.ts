import api from './axios';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';

export const register = (data: RegisterPayload) =>
  api.post<AuthResponse>('/auth/register', data).then((r) => r.data);

export const login = (data: LoginPayload) =>
  api.post<AuthResponse>('/auth/login', data).then((r) => r.data);
