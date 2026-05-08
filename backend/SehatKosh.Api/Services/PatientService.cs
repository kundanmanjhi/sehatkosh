using Microsoft.EntityFrameworkCore;
using SehatKosh.Api.Data;
using SehatKosh.Api.DTOs.Patient;
using SehatKosh.Api.Models;
using SehatKosh.Api.Services.Interfaces;

namespace SehatKosh.Api.Services;

public class PatientService : IPatientService
{
    private readonly AppDbContext _db;

    public PatientService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<PatientDto>> GetAllAsync()
    {
        return await _db.Patients.Include(p => p.User).Select(p => MapToDto(p)).ToListAsync();
    }

    public async Task<PatientDto?> GetByIdAsync(int id)
    {
        var patient = await _db.Patients.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);
        return patient == null ? null : MapToDto(patient);
    }

    public async Task<PatientDto?> GetByUserIdAsync(string userId)
    {
        var patient = await _db.Patients.Include(p => p.User).FirstOrDefaultAsync(p => p.UserId == userId);
        return patient == null ? null : MapToDto(patient);
    }

    public async Task<PatientDto> CreateAsync(string userId, CreatePatientDto dto)
    {
        var patient = new Patient
        {
            UserId = userId,
            DateOfBirth = dto.DateOfBirth,
            Gender = dto.Gender,
            BloodGroup = dto.BloodGroup,
            PhoneNumber = dto.PhoneNumber,
            Address = dto.Address,
            MedicalHistory = dto.MedicalHistory,
            Allergies = dto.Allergies
        };
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();
        await _db.Entry(patient).Reference(p => p.User).LoadAsync();
        return MapToDto(patient);
    }

    public async Task<PatientDto?> UpdateAsync(int id, UpdatePatientDto dto)
    {
        var patient = await _db.Patients.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);
        if (patient == null) return null;

        patient.DateOfBirth = dto.DateOfBirth;
        patient.Gender = dto.Gender;
        patient.BloodGroup = dto.BloodGroup;
        patient.PhoneNumber = dto.PhoneNumber;
        patient.Address = dto.Address;
        patient.MedicalHistory = dto.MedicalHistory;
        patient.Allergies = dto.Allergies;

        await _db.SaveChangesAsync();
        return MapToDto(patient);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var patient = await _db.Patients.FindAsync(id);
        if (patient == null) return false;
        _db.Patients.Remove(patient);
        await _db.SaveChangesAsync();
        return true;
    }

    private static PatientDto MapToDto(Patient p) => new()
    {
        Id = p.Id,
        UserId = p.UserId,
        FullName = $"{p.User.FirstName} {p.User.LastName}",
        Email = p.User.Email ?? string.Empty,
        DateOfBirth = p.DateOfBirth,
        Gender = p.Gender,
        BloodGroup = p.BloodGroup,
        PhoneNumber = p.PhoneNumber,
        Address = p.Address,
        MedicalHistory = p.MedicalHistory,
        Allergies = p.Allergies,
        CreatedAt = p.CreatedAt
    };
}
