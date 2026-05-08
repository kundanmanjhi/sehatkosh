using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SehatKosh.Api.DTOs.Appointment;
using SehatKosh.Api.Services.Interfaces;

namespace SehatKosh.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;
    private readonly IPatientService _patientService;

    public AppointmentsController(IAppointmentService appointmentService, IPatientService patientService)
    {
        _appointmentService = appointmentService;
        _patientService = patientService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() => Ok(await _appointmentService.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var appt = await _appointmentService.GetByIdAsync(id);
        return appt == null ? NotFound() : Ok(appt);
    }

    [HttpGet("patient/{patientId:int}")]
    public async Task<IActionResult> GetByPatient(int patientId)
        => Ok(await _appointmentService.GetByPatientIdAsync(patientId));

    [HttpGet("doctor/{doctorId:int}")]
    public async Task<IActionResult> GetByDoctor(int doctorId)
        => Ok(await _appointmentService.GetByDoctorIdAsync(doctorId));

    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> Create([FromBody] CreateAppointmentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var patient = await _patientService.GetByUserIdAsync(userId);
        if (patient == null) return BadRequest(new { message = "Patient profile not found." });

        var appt = await _appointmentService.CreateAsync(patient.Id, dto);
        return CreatedAtAction(nameof(GetById), new { id = appt.Id }, appt);
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateAppointmentStatusDto dto)
    {
        var appt = await _appointmentService.UpdateStatusAsync(id, dto);
        return appt == null ? NotFound() : Ok(appt);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _appointmentService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
