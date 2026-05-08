using SehatKosh.Api.DTOs.Doctor;

namespace SehatKosh.Api.Services.Interfaces;

public interface IDoctorService
{
    Task<IEnumerable<DoctorDto>> GetAllAsync();
    Task<DoctorDto?> GetByIdAsync(int id);
    Task<DoctorDto?> GetByUserIdAsync(string userId);
    Task<DoctorDto> CreateAsync(string userId, CreateDoctorDto dto);
    Task<DoctorDto?> UpdateAsync(int id, UpdateDoctorDto dto);
    Task<bool> DeleteAsync(int id);
}
