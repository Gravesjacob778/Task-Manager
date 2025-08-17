using LLama;
using LLama.Common;
using System.Text;

namespace back_end.AI;

public sealed class LocalLlamaClient : IDisposable
{
    private readonly LLamaWeights _weights;
    private readonly LLamaContext _context;
    private readonly InferenceParams _inferenceParams;
    private bool _disposed;

    public LocalLlamaClient(string modelPath, int contextSize = 2048, int gpuLayers = 0)
    {
        if (!File.Exists(modelPath))
            throw new FileNotFoundException($"Model file not found at: {modelPath}");

        var modelParams = new ModelParams(modelPath)
        {
            ContextSize = (uint)contextSize,
            GpuLayerCount = gpuLayers,
        };

        _weights = LLamaWeights.LoadFromFile(modelParams);
        _context = _weights.CreateContext(modelParams);

        _inferenceParams = new InferenceParams
        {
            MaxTokens = 512,
            AntiPrompts = ["</s>", "[/INST]", "User:", "Assistant:"]
        };
    }

    public async Task<string> AskAsync(string prompt, CancellationToken cancellationToken = default)
    {
        var executor = new InteractiveExecutor(_context);
        var sb = new StringBuilder();
        
        await foreach (var token in executor.InferAsync(prompt, _inferenceParams, cancellationToken))
        {
            sb.Append(token);
        }
        
        return sb.ToString();
    }

    public string Ask(string prompt, CancellationToken cancellationToken = default)
    {
        var executor = new InteractiveExecutor(_context);
        var sb = new StringBuilder();
        
        // 使用同步版本
        var task = Task.Run(async () =>
        {
            await foreach (var token in executor.InferAsync(prompt, _inferenceParams, cancellationToken))
            {
                sb.Append(token);
            }
        }, cancellationToken);
        
        task.Wait(cancellationToken);
        return sb.ToString();
    }

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        _context?.Dispose();
        _weights?.Dispose();
    }
}
