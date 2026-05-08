using Microsoft.AspNetCore.Identity;

namespace SehatKosh.Api.Models;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = "Patient";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
