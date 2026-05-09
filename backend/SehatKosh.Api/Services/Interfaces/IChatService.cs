using SehatKosh.Api.DTOs.Chat;

namespace SehatKosh.Api.Services.Interfaces;

public interface IChatService
{
    Task<string> GetSymptomAdviceAsync(List<ChatMessageDto> messages);
}
