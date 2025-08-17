# AI 聊天機器人串接說明

## 功能概述
已成功將聊天頁面 (`/chat`) 串接後端 `chat/complete` API，支援完整的對話歷史上下文。

## 修改內容

### 1. 聊天 API 串接
- **檔案**: `src/app/[locale]/chat/page.tsx`
- **功能**: 將 `sendMessage` 函數改為呼叫新的 chat/complete API
- **API 端點**: `/api/Ai/chat/complete` (POST)

### 2. 請求格式 (ChatRequest)
```json
{
  "System": "你是一個有幫助的 AI 助手，請用中文回覆。",
  "Messages": [
    {
      "Role": "user",
      "Content": "用戶輸入的訊息"
    }
  ],
  "MaxTokens": 512
}
```

### 3. 回應格式
```json
{
  "success": true,
  "data": "AI 的回覆內容",
  "message": "成功訊息"
}
```

### 4. 功能特點
- **對話上下文**：自動傳送最近10則訊息作為歷史記錄
- **角色映射**：前端 `sent` → 後端 `user`，前端 `received` → 後端 `assistant`
- **系統提示**：預設設定 AI 使用中文回覆
- **Token 限制**：每次回覆最多 512 tokens

### 5. 錯誤處理
- 網路錯誤：顯示 "抱歉，發生錯誤，請稍後再試。"
- API 錯誤：顯示後端回傳的錯誤訊息
- 詳細日誌：Console 顯示請求和回應內容

## 後端 API 結構

### ChatRequest 類別
- `System`: 系統提示詞（可選）
- `Messages`: 對話訊息陣列
- `MaxTokens`: 最大回覆 token 數
- `StopSequences`: 停止序列（可選）

### ChatTurn 類別
- `Role`: "system" | "user" | "assistant"
- `Content`: 訊息內容

## 使用方式

1. 確保後端服務運行在 `http://localhost:5157`
2. 打開聊天頁面 (`/chat`)
3. 輸入訊息並發送
4. AI 會根據對話歷史提供上下文相關的回覆

## 技術改進

- ✅ 完整的對話上下文支援
- ✅ TypeScript 嚴格型別檢查
- ✅ 智能對話歷史管理（最近10則）
- ✅ 系統提示詞設定
- ✅ 詳細的除錯日誌
- ✅ 錯誤狀態處理

## 測試建議

1. 測試連續對話的上下文理解
2. 測試長對話的歷史記錄截取
3. 測試網路中斷情況
4. 測試後端服務離線情況
5. 檢查 Console 日誌確認請求格式
