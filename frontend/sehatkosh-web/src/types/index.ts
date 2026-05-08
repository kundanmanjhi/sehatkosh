export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  expiresAt: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'Patient' | 'Doctor' | 'Admin';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Patient {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phoneNumber: string;
  address: string;
  medicalHistory?: string;
  allergies?: string;
  createdAt: string;
}

export interface Doctor {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  phoneNumber: string;
  experienceYears: number;
  qualifications?: string;
  bio?: string;
  consultationFee: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  symptoms?: string;
  createdAt: string;
}

export interface CreateAppointmentPayload {
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
  symptoms?: string;
  notes?: string;
}

export interface ApiError {
  message: string;
}
