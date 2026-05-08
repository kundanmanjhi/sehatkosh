using Microsoft.EntityFrameworkCore;
using SehatKosh.Api.Data;
using SehatKosh.Api.DTOs.Doctor;
using SehatKosh.Api.Models;
using SehatKosh.Api.Services.Interfaces;

namespace SehatKosh.Api.Services;

public class DoctorService : IDoctorService
{
    private readonly AppDbContext _db;

    public DoctorService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<DoctorDto>> GetAllAsync()
    {
        return await _db.Doctors.Include(d => d.User).Select(d => MapToDto(d)).ToListAsync();
    }

    public async Task<DoctorDto?> GetByIdAsync(int id)
    {
        var doctor = await _db.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
        return doctor == null ? null : MapToDto(doctor);
    }

    public async Task<DoctorDto?> GetByUserIdAsync(string userId)
    {
        var doctor = await _db.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.UserId == userId);
        return doctor == null ? null : MapToDto(doctor);
    }

    public async Task<DoctorDto> CreateAsync(string userId, CreateDoctorDto dto)
    {
        var doctor = new Doctor
        {
            UserId = userId,
            Specialization = dto.Specialization,
            LicenseNumber = dto.LicenseNumber,
            PhoneNumber = dto.PhoneNumber,
            ExperienceYears = dto.ExperienceYears,
            Qualifications = dto.Qualifications,
            Bio = dto.Bio,
            ConsultationFee = dto.ConsultationFee
        };
        _db.Doctors.Add(doctor);
        await _db.SaveChangesAsync();
        await _db.Entry(doctor).Reference(d => d.User).LoadAsync();
        return MapToDto(doctor);
    }

    public async Task<DoctorDto?> UpdateAsync(int id, UpdateDoctorDto dto)
    {
        var doctor = await _db.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
        if (doctor == null) return null;

        doctor.Specialization = dto.Specialization;
        doctor.PhoneNumber = dto.PhoneNumber;
        doctor.ExperienceYears = dto.ExperienceYears;
        doctor.Qualifications = dto.Qualifications;
        doctor.Bio = dto.Bio;
        doctor.ConsultationFee = dto.ConsultationFee;
        doctor.IsAvailable = dto.IsAvailable;

        await _db.SaveChangesAsync();
        return MapToDto(doctor);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var doctor = await _db.Doctors.FindAsync(id);
        if (doctor == null) return false;
        _db.Doctors.Remove(doctor);
        await _db.SaveChangesAsync();
        return true;
    }

    private static DoctorDto MapToDto(Doctor d) => new()
    {
        Id = d.Id,
        UserId = d.UserId,
        FullName = $"{d.User.FirstName} {d.User.LastName}",
        Email = d.User.Email ?? string.Empty,
        Specialization = d.Specialization,
        LicenseNumber = d.LicenseNumber,
        PhoneNumber = d.PhoneNumber,
        ExperienceYears = d.ExperienceYears,
        Qualifications = d.Qualifications,
        Bio = d.Bio,
        ConsultationFee = d.ConsultationFee,
        IsAvailable = d.IsAvailable,
        CreatedAt = d.CreatedAt
    };
}
