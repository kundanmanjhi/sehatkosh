using Microsoft.EntityFrameworkCore;
using SehatKosh.Api.Data;
using SehatKosh.Api.DTOs.Appointment;
using SehatKosh.Api.Models;
using SehatKosh.Api.Services.Interfaces;

namespace SehatKosh.Api.Services;

public class AppointmentService : IAppointmentService
{
    private readonly AppDbContext _db;

    public AppointmentService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<AppointmentDto>> GetAllAsync()
    {
        return await _db.Appointments
            .Include(a => a.Patient).ThenInclude(p => p.User)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .Select(a => MapToDto(a)).ToListAsync();
    }

    public async Task<IEnumerable<AppointmentDto>> GetByPatientIdAsync(int patientId)
    {
        return await _db.Appointments
            .Include(a => a.Patient).ThenInclude(p => p.User)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .Where(a => a.PatientId == patientId)
            .Select(a => MapToDto(a)).ToListAsync();
    }

    public async Task<IEnumerable<AppointmentDto>> GetByDoctorIdAsync(int doctorId)
    {
        return await _db.Appointments
            .Include(a => a.Patient).ThenInclude(p => p.User)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .Where(a => a.DoctorId == doctorId)
            .Select(a => MapToDto(a)).ToListAsync();
    }

    public async Task<AppointmentDto?> GetByIdAsync(int id)
    {
        var appt = await _db.Appointments
            .Include(a => a.Patient).ThenInclude(p => p.User)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .FirstOrDefaultAsync(a => a.Id == id);
        return appt == null ? null : MapToDto(appt);
    }

    public async Task<AppointmentDto> CreateAsync(int patientId, CreateAppointmentDto dto)
    {
        var appt = new Appointment
        {
            PatientId = patientId,
            DoctorId = dto.DoctorId,
            AppointmentDate = dto.AppointmentDate,
            TimeSlot = dto.TimeSlot,
            Symptoms = dto.Symptoms,
            Notes = dto.Notes,
            Status = "Pending"
        };
        _db.Appointments.Add(appt);
        await _db.SaveChangesAsync();

        await _db.Entry(appt).Reference(a => a.Patient).Query().Include(p => p.User).LoadAsync();
        await _db.Entry(appt).Reference(a => a.Doctor).Query().Include(d => d.User).LoadAsync();
        return MapToDto(appt);
    }

    public async Task<AppointmentDto?> UpdateStatusAsync(int id, UpdateAppointmentStatusDto dto)
    {
        var appt = await _db.Appointments
            .Include(a => a.Patient).ThenInclude(p => p.User)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (appt == null) return null;

        appt.Status = dto.Status;
        if (dto.Notes != null) appt.Notes = dto.Notes;
        await _db.SaveChangesAsync();
        return MapToDto(appt);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var appt = await _db.Appointments.FindAsync(id);
        if (appt == null) return false;
        _db.Appointments.Remove(appt);
        await _db.SaveChangesAsync();
        return true;
    }

    private static AppointmentDto MapToDto(Appointment a) => new()
    {
        Id = a.Id,
        PatientId = a.PatientId,
        PatientName = $"{a.Patient.User.FirstName} {a.Patient.User.LastName}",
        DoctorId = a.DoctorId,
        DoctorName = $"{a.Doctor.User.FirstName} {a.Doctor.User.LastName}",
        DoctorSpecialization = a.Doctor.Specialization,
        AppointmentDate = a.AppointmentDate,
        TimeSlot = a.TimeSlot,
        Status = a.Status,
        Notes = a.Notes,
        Symptoms = a.Symptoms,
        CreatedAt = a.CreatedAt
    };
}
