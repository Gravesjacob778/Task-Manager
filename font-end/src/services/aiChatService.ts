import { HttpActionResponse } from "@/model/httpActionResponse";
import { BaseService } from "./baseService";
import { IService } from "./serviceInterface";

interface ChatMessage {
    type: 'sent' | 'received';
    content: string;
}

class AIChatService extends BaseService implements IService {
    private baseUrl: string;
    constructor(baseUrl: string) {
        super();
        this.baseUrl = baseUrl;
    }
    obtain(_id: string): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    create(_task: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    update(_id: string, _task: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }

    async sendMessage(message: string, history?: ChatMessage[]): Promise<string> {
        try {
            console.log('發送請求到:', `${this.baseUrl}/Ai/chat/complete`);
            
            // 根據後端 ChatRequest 格式構建請求
            const chatRequest = {
                System: "你是一個有幫助的 AI 助手，請用中文回覆。",
                Messages: [
                    // 如果有歷史記錄，加入前面的對話
                    ...(history || []).slice(-10).map((msg: ChatMessage) => ({
                        Role: msg.type === 'sent' ? 'user' : 'assistant',
                        Content: msg.content
                    })),
                    // 加入當前用戶訊息
                    {
                        Role: "user",
                        Content: message
                    }
                ],
                MaxTokens: 512
            };
            
            console.log('請求內容:', chatRequest);
            
            const response: HttpActionResponse = await this.post(`${this.baseUrl}/Ai/chat/complete`, chatRequest);
            
            console.log('收到回應:', response);
            
            response.data = (response.data as string).replace('```', '').replace('```', '');
            if (response.success) {
                return response.data as string;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('AI Chat Service 錯誤:', error);
            throw error;
        }
    }
  
}
const aiChatService = new AIChatService('http://localhost:5157/api');
export default aiChatService;