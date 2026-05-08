import api from './axios';
import type { Patient } from '../types';

export const getPatients = () =>
  api.get<Patient[]>('/patients').then((r) => r.data);

export const getPatient = (id: number) =>
  api.get<Patient>(`/patients/${id}`).then((r) => r.data);

export const getMyPatientProfile = () =>
  api.get<Patient>('/patients/me').then((r) => r.data);

export const createPatient = (data: Omit<Patient, 'id' | 'userId' | 'fullName' | 'email' | 'createdAt'>) =>
  api.post<Patient>('/patients', data).then((r) => r.data);

export const updatePatient = (id: number, data: Partial<Patient>) =>
  api.put<Patient>(`/patients/${id}`, data).then((r) => r.data);

export const deletePatient = (id: number) =>
  api.delete(`/patients/${id}`);
