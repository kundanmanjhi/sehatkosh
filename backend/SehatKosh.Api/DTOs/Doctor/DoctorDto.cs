namespace SehatKosh.Api.DTOs.Doctor;

public class DoctorDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public int ExperienceYears { get; set; }
    public string? Qualifications { get; set; }
    public string? Bio { get; set; }
    public decimal ConsultationFee { get; set; }
    public bool IsAvailable { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateDoctorDto
{
    public string Specialization { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public int ExperienceYears { get; set; }
    public string? Qualifications { get; set; }
    public string? Bio { get; set; }
    public decimal ConsultationFee { get; set; }
}

public class UpdateDoctorDto
{
    public string Specialization { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public int ExperienceYears { get; set; }
    public string? Qualifications { get; set; }
    public string? Bio { get; set; }
    public decimal ConsultationFee { get; set; }
    public bool IsAvailable { get; set; }
}
