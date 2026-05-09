using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using SehatKosh.Api.DTOs.Chat;
using SehatKosh.Api.Services.Interfaces;

namespace SehatKosh.Api.Services;

public class ChatService : IChatService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    private const string SystemPrompt = """
        You are SehatKosh AI — a helpful medical symptom assistant for Indian patients.

        Your role:
        - Listen carefully to the patient's symptoms
        - Ask relevant follow-up questions (duration, severity, location, associated symptoms)
        - Give clear, simple health advice in the same language the patient uses (Hindi or English)
        - Suggest possible causes, but NEVER give a definitive diagnosis
        - Recommend home remedies (gharelu nuskhe) for mild symptoms when appropriate
        - Always recommend consulting a real doctor (doctor se milein) for serious, severe, or persistent symptoms
        - If symptoms suggest an emergency (chest pain, breathing difficulty, stroke signs, high fever in children), immediately advise to call 112 or go to the nearest hospital

        Important rules:
        - Keep responses concise and easy to understand
        - Use bullet points for clarity
        - Always end with a note to consult a doctor if symptoms persist
        - Do NOT prescribe specific medications or dosages
        - Be empathetic and caring in your tone
        - Use Indian medical context: AIIMS, government hospitals, Ayushman Bharat, ASHA workers where relevant
        - Common Indian conditions to be aware of: dengue, typhoid, malaria, seasonal flu, heat stroke in summers

        Format your response with clear sections when needed, using simple language suitable for general public.
        """;

    public ChatService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<string> GetSymptomAdviceAsync(List<ChatMessageDto> messages)
    {
        var apiKey = _config["Anthropic:ApiKey"]
            ?? throw new InvalidOperationException("Anthropic API key not configured.");

        var requestBody = new
        {
            model = "claude-haiku-4-5-20251001",
            max_tokens = 1024,
            system = SystemPrompt,
            messages = messages.Select(m => new { role = m.Role, content = m.Content }).ToArray()
        };

        var json = JsonSerializer.Serialize(requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.anthropic.com/v1/messages")
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
        request.Headers.Add("x-api-key", apiKey);
        request.Headers.Add("anthropic-version", "2023-06-01");

        var response = await _httpClient.SendAsync(request);
        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"Anthropic API error: {responseJson}");

        using var doc = JsonDocument.Parse(responseJson);
        var text = doc.RootElement
            .GetProperty("content")[0]
            .GetProperty("text")
            .GetString();

        return text ?? "Sorry, I could not generate a response.";
    }
}
