using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SehatKosh.Api.DTOs.Chat;
using SehatKosh.Api.Services.Interfaces;

namespace SehatKosh.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(IChatService chatService, ILogger<ChatController> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    [HttpPost("symptoms")]
    public async Task<IActionResult> GetSymptomAdvice([FromBody] SymptomChatRequestDto dto)
    {
        if (dto.Messages == null || dto.Messages.Count == 0)
            return BadRequest(new { message = "Messages cannot be empty." });

        try
        {
            var reply = await _chatService.GetSymptomAdviceAsync(dto.Messages);
            return Ok(new SymptomChatResponseDto { Reply = reply });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Chat service error");
            return StatusCode(500, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in symptom chat");
            return StatusCode(500, new { message = "Chat service temporarily unavailable." });
        }
    }
}
