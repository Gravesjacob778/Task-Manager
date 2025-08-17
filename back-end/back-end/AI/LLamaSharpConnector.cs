using LLama;
using LLama.Common;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.TextGeneration;
using System.Runtime.CompilerServices;
using System.Text;
using SKAuthorRole = Microsoft.SemanticKernel.ChatCompletion.AuthorRole;
using SKChatHistory = Microsoft.SemanticKernel.ChatCompletion.ChatHistory;
using SKTextContent = Microsoft.SemanticKernel.TextContent;

namespace back_end.AI
{
    /// <summary>
    /// LLamaSharp 連接器，用於與本地 LLM 模型交互
    /// </summary>
    public class LLamaSharpConnector : IChatCompletionService, ITextGenerationService
    {
        private readonly LLamaWeights _model;
        private readonly LLamaContext _context;
        private readonly ModelParams _modelParams;

        public IReadOnlyDictionary<string, object?> Attributes => new Dictionary<string, object?>();

        /// <summary>
        /// 初始化 LLamaSharp 連接器
        /// </summary>
        /// <param name="modelPath">模型文件路徑 (.gguf 格式)</param>
        /// <param name="contextSize">上下文大小，默認 2048</param>
        /// <param name="gpuLayerCount">GPU 層數，0 表示 CPU 模式</param>
        public LLamaSharpConnector(string modelPath, uint contextSize = 2048, int gpuLayerCount = 0)
        {
            if (!File.Exists(modelPath))
            {
                throw new FileNotFoundException($"模型文件不存在: {modelPath}");
            }

            try
            {
                // 配置模型參數
                _modelParams = new ModelParams(modelPath)
                {
                    ContextSize = contextSize,
                    GpuLayerCount = gpuLayerCount
                };

                // 加載模型
                Console.WriteLine($"正在加載模型: {modelPath}");
                _model = LLamaWeights.LoadFromFile(_modelParams);
                Console.WriteLine("模型加載成功!");

                _context = _model.CreateContext(_modelParams);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"初始化 LLamaSharp 連接器失敗: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// 獲取聊天消息內容
        /// </summary>
        public async IAsyncEnumerable<StreamingChatMessageContent> GetStreamingChatMessageContentsAsync(
            SKChatHistory chatHistory,
            PromptExecutionSettings? executionSettings = null,
            Kernel? kernel = null,
            [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            var prompt = BuildPromptFromChatHistory(chatHistory);
            var inferenceParams = CreateInferenceParams(executionSettings);

            // 每次請求建立新的 executor 避免狀態污染
            var executor = new InteractiveExecutor(_context);
            await foreach (var token in executor.InferAsync(prompt, inferenceParams, cancellationToken))
            {
                yield return new StreamingChatMessageContent(SKAuthorRole.Assistant, token);
            }
        }

        /// <summary>
        /// 獲取聊天消息內容（非流式）
        /// </summary>
        public async Task<IReadOnlyList<ChatMessageContent>> GetChatMessageContentsAsync(
            SKChatHistory chatHistory,
            PromptExecutionSettings? executionSettings = null,
            Kernel? kernel = null,
            CancellationToken cancellationToken = default)
        {
            var prompt = BuildPromptFromChatHistory(chatHistory);
            var inferenceParams = CreateInferenceParams(executionSettings);

            var response = new StringBuilder();
            // 每次請求建立新的 executor 避免狀態污染
            var executor = new InteractiveExecutor(_context);
            await foreach (var token in executor.InferAsync(prompt, inferenceParams, cancellationToken))
            {
                response.Append(token);
            }

            return
            [
                new ChatMessageContent(SKAuthorRole.Assistant, response.ToString())
            ];
        }

        /// <summary>
        /// 獲取文本內容（流式）
        /// </summary>
        public async IAsyncEnumerable<StreamingTextContent> GetStreamingTextContentsAsync(
            string prompt,
            PromptExecutionSettings? executionSettings = null,
            Kernel? kernel = null,
            [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            var inferenceParams = CreateInferenceParams(executionSettings);

            // 每次請求建立新的 executor 避免狀態污染
            var executor = new InteractiveExecutor(_context);
            await foreach (var token in executor.InferAsync(prompt, inferenceParams, cancellationToken))
            {
                yield return new StreamingTextContent(token);
            }
        }

        /// <summary>
        /// 獲取文本內容（非流式）
        /// </summary>
        public async Task<IReadOnlyList<SKTextContent>> GetTextContentsAsync(
            string prompt,
            PromptExecutionSettings? executionSettings = null,
            Kernel? kernel = null,
            CancellationToken cancellationToken = default)
        {
            var inferenceParams = CreateInferenceParams(executionSettings);

            var response = new StringBuilder();
            // 每次請求建立新的 executor 避免狀態污染
            var executor = new InteractiveExecutor(_context);
            await foreach (var token in executor.InferAsync(prompt, inferenceParams, cancellationToken))
            {
                response.Append(token);
            }

            return new List<SKTextContent>
            {
                new SKTextContent(response.ToString())
            };
        }

        /// <summary>
        /// 從聊天歷史構建提示 - 使用 Gemma 3 聊天模板
        /// </summary>
        private static string BuildPromptFromChatHistory(SKChatHistory chatHistory)
        {
            var sb = new StringBuilder();

            // 處理 system 訊息 (只取第一個)
            var systemMessage = chatHistory
                .Where(m => m.Role.Label?.Equals("system", StringComparison.OrdinalIgnoreCase) == true)
                .Select(m => m.Content)
                .FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(systemMessage))
            {
                sb.AppendLine("<start_of_turn>system");
                sb.AppendLine(systemMessage);
                sb.AppendLine("<end_of_turn>");
            }

            // 處理對話歷史
            foreach (var message in chatHistory)
            {
                var role = message.Role.Label?.ToLowerInvariant();
                if (role == "user")
                {
                    sb.AppendLine("<start_of_turn>user");
                    sb.AppendLine(message.Content);
                    sb.AppendLine("<end_of_turn>");
                }
                else if (role == "assistant")
                {
                    sb.AppendLine("<start_of_turn>model");
                    sb.AppendLine(message.Content);
                    sb.AppendLine("<end_of_turn>");
                }
            }

            // 開始模型回應
            sb.Append("<start_of_turn>model\n");
            return sb.ToString();
        }

        /// <summary>
        /// 創建推理參數 - 針對 Gemma 3 優化
        /// </summary>
        private InferenceParams CreateInferenceParams(PromptExecutionSettings? executionSettings)
        {
            var llamaSettings = executionSettings as LLamaSharpExecutionSettings ?? new LLamaSharpExecutionSettings();

            return new InferenceParams()
            {
                MaxTokens = llamaSettings.MaxTokens,
                // 使用 Gemma 的正確終止標記
                AntiPrompts = llamaSettings.StopSequences?.ToList() ?? new List<string> { "<end_of_turn>" }
            };
        }

        /// <summary>
        /// 釋放資源
        /// </summary>
        public void Dispose()
        {
            _context?.Dispose();
            _model?.Dispose();
        }
    }

    /// <summary>
    /// LLamaSharp 執行設定 - 針對 Gemma 3 優化
    /// </summary>
    public class LLamaSharpExecutionSettings : PromptExecutionSettings
    {
        public int MaxTokens { get; set; } = 512;
        public IList<string>? StopSequences { get; set; } = new List<string> { "<end_of_turn>" };
    }
}
