using SehatKosh.Api.DTOs.Patient;

namespace SehatKosh.Api.Services.Interfaces;

public interface IPatientService
{
    Task<IEnumerable<PatientDto>> GetAllAsync();
    Task<PatientDto?> GetByIdAsync(int id);
    Task<PatientDto?> GetByUserIdAsync(string userId);
    Task<PatientDto> CreateAsync(string userId, CreatePatientDto dto);
    Task<PatientDto?> UpdateAsync(int id, UpdatePatientDto dto);
    Task<bool> DeleteAsync(int id);
}
