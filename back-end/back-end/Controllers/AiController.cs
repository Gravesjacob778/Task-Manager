using back_end.AI;
using back_end.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel.ChatCompletion;

namespace back_end.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AiController(LocalLlamaClient llama, IChatCompletionService chat) : ControllerBase
{
    private readonly LocalLlamaClient _llama = llama;
    private readonly IChatCompletionService _chat = chat;

    [HttpPost("ask")]
    public async Task<ActionResult<HttpActionResponse<string>>> AskAsync([FromBody] AskRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Prompt))
            return HttpActionResponse<string>.Fail("Prompt is required");

        try
        {
            var answer = await _llama.AskAsync(request.Prompt, ct);
            return HttpActionResponse<string>.Ok(answer);
        }
        catch (Exception ex)
        {
            return HttpActionResponse<string>.Fail($"Error: {ex.Message}");
        }
    }

    [HttpPost("ask-sync")]
    public ActionResult<HttpActionResponse<string>> Ask([FromBody] AskRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Prompt))
            return HttpActionResponse<string>.Fail("Prompt is required");

        try
        {
            var answer = _llama.Ask(request.Prompt, ct);
            return HttpActionResponse<string>.Ok(answer);
        }
        catch (Exception ex)
        {
            return HttpActionResponse<string>.Fail($"Error: {ex.Message}");
        }
    }

    [HttpPost("chat/complete")]
    public async Task<ActionResult<HttpActionResponse<string>>> CompleteAsync([FromBody] ChatRequest request, CancellationToken ct)
    {
        if (request is null || (request.Messages?.Count ?? 0) == 0)
            return HttpActionResponse<string>.Fail("Messages is required.");

        var history = new ChatHistory();
        if (!string.IsNullOrWhiteSpace(request.System))
            history.AddSystemMessage(request.System);

        foreach (var m in request.Messages!)
        {
            switch ((m.Role ?? "user").Trim().ToLowerInvariant())
            {
                case "system": history.AddSystemMessage(m.Content); break;
                case "assistant": history.AddAssistantMessage(m.Content); break;
                default: history.AddUserMessage(m.Content); break;
            }
        }

        var settings = new back_end.AI.LLamaSharpExecutionSettings
        {
            MaxTokens = request.MaxTokens ?? 256,
            StopSequences = request.StopSequences?.ToList()
        };

        var replies = await _chat.GetChatMessageContentsAsync(history, settings, kernel: null, ct);
        var content = replies.FirstOrDefault()?.Content ?? string.Empty;
        return HttpActionResponse<string>.Ok(content);
    }
}

public record AskRequest(string Prompt);

public sealed class ChatRequest
{
    public string? System { get; set; }
    public List<ChatTurn>? Messages { get; set; }
    public int? MaxTokens { get; set; }
    public IEnumerable<string>? StopSequences { get; set; }
}

public sealed class ChatTurn
{
    public string Role { get; set; } = "user"; // system|user|assistant
    public string Content { get; set; } = string.Empty;
}
