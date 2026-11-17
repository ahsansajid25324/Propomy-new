export type Message = {
  role: "user" | "assistant";
  text: string;
  id: number;
};

export interface ChatWithAIResponse {
  chatWithAI: {
    success: boolean;
    message: string;
    sessionId: string | null;
    chatApiLimit?: number;
  };
}
