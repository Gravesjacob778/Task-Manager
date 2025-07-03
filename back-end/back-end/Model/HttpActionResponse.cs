namespace back_end.Model
{
    public class HttpActionResponse
    {
        /// <summary>
        /// 是否成功
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// 回應訊息（如錯誤說明或成功提示）
        /// </summary>
        public string? Message { get; set; }

        /// <summary>
        /// 回傳資料
        /// </summary>
        public object? Data { get; set; }
    }
}
