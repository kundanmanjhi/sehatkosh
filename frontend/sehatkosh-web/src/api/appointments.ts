import api from './axios';
import type { Appointment, CreateAppointmentPayload } from '../types';

export const getAppointments = () =>
  api.get<Appointment[]>('/appointments').then((r) => r.data);

export const getAppointmentsByPatient = (patientId: number) =>
  api.get<Appointment[]>(`/appointments/patient/${patientId}`).then((r) => r.data);

export const getAppointmentsByDoctor = (doctorId: number) =>
  api.get<Appointment[]>(`/appointments/doctor/${doctorId}`).then((r) => r.data);

export const createAppointment = (data: CreateAppointmentPayload) =>
  api.post<Appointment>('/appointments', data).then((r) => r.data);

export const updateAppointmentStatus = (id: number, status: string, notes?: string) =>
  api.patch<Appointment>(`/appointments/${id}/status`, { status, notes }).then((r) => r.data);

export const deleteAppointment = (id: number) =>
  api.delete(`/appointments/${id}`);
