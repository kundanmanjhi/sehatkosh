import api from './axios';
import type { Doctor } from '../types';

export const getDoctors = () =>
  api.get<Doctor[]>('/doctors').then((r) => r.data);

export const getDoctor = (id: number) =>
  api.get<Doctor>(`/doctors/${id}`).then((r) => r.data);

export const getMyDoctorProfile = () =>
  api.get<Doctor>('/doctors/me').then((r) => r.data);

export const createDoctor = (data: Partial<Doctor>) =>
  api.post<Doctor>('/doctors', data).then((r) => r.data);

export const updateDoctor = (id: number, data: Partial<Doctor>) =>
  api.put<Doctor>(`/doctors/${id}`, data).then((r) => r.data);
