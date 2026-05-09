namespace SehatKosh.Api.DTOs.Chat;

public class ChatMessageDto
{
    public string Role { get; set; } = string.Empty;    // "user" or "assistant"
    public string Content { get; set; } = string.Empty;
}

public class SymptomChatRequestDto
{
    public List<ChatMessageDto> Messages { get; set; } = new();
}

public class SymptomChatResponseDto
{
    public string Reply { get; set; } = string.Empty;
}
