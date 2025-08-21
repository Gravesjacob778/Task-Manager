namespace back_end.AI;

public static class AiServiceCollectionExtensions
{
    public static IServiceCollection AddLocalLlama(this IServiceCollection services, IConfiguration configuration)
    {
        var modelPath = configuration.GetValue<string>("LocalLlama:ModelPath")
            ?? throw new InvalidOperationException("Config LocalLlama:ModelPath is required.");
        var ctx = configuration.GetValue<int?>("LocalLlama:ContextSize") ?? 2048;
        var gpuLayers = configuration.GetValue<int?>("LocalLlama:GpuLayers") ?? 0;

        services.AddSingleton(sp => new LocalLlamaClient(modelPath, ctx, gpuLayers));
        return services;
    }
}
