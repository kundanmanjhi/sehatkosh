using SehatKosh.Api.DTOs.Appointment;

namespace SehatKosh.Api.Services.Interfaces;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentDto>> GetAllAsync();
    Task<IEnumerable<AppointmentDto>> GetByPatientIdAsync(int patientId);
    Task<IEnumerable<AppointmentDto>> GetByDoctorIdAsync(int doctorId);
    Task<AppointmentDto?> GetByIdAsync(int id);
    Task<AppointmentDto> CreateAsync(int patientId, CreateAppointmentDto dto);
    Task<AppointmentDto?> UpdateStatusAsync(int id, UpdateAppointmentStatusDto dto);
    Task<bool> DeleteAsync(int id);
}
