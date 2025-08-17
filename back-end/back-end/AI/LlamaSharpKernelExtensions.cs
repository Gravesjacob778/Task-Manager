using back_end.AI;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.TextGeneration;
using Microsoft.SemanticKernel;

namespace back_end;

public static class LlamaSharpKernelExtensions
{
    public static IServiceCollection AddLlamaSharpConnector(this IServiceCollection services, IConfiguration config)
    {
        var modelPath = config.GetValue<string>("LocalLlama:ModelPath")
            ?? throw new InvalidOperationException("Missing config: LocalLlama:ModelPath");
        var ctxSize = (uint)(config.GetValue<int?>("LocalLlama:ContextSize") ?? 2048);
        var gpuLayers = config.GetValue<int?>("LocalLlama:GpuLayers") ?? 0;

        services.AddSingleton<LLamaSharpConnector>(sp => new LLamaSharpConnector(modelPath, ctxSize, gpuLayers));
        services.AddSingleton<IChatCompletionService>(sp => sp.GetRequiredService<LLamaSharpConnector>());
        services.AddSingleton<ITextGenerationService>(sp => sp.GetRequiredService<LLamaSharpConnector>());

        services.AddSingleton(sp =>
        {
            var builder = Kernel.CreateBuilder();
            builder.Services.AddSingleton<IChatCompletionService>(sp.GetRequiredService<LLamaSharpConnector>());
            builder.Services.AddSingleton<ITextGenerationService>(sp.GetRequiredService<LLamaSharpConnector>());
            return builder.Build();
        });

        return services;
    }
}
