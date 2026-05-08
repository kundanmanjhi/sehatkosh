namespace SehatKosh.Api.Models;

public class Prescription
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;
    public string Diagnosis { get; set; } = string.Empty;
    public string Medications { get; set; } = string.Empty;
    public string? Instructions { get; set; }
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ValidUntil { get; set; }
}
