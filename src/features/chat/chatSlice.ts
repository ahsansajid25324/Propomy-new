import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../../types/ChatBot";

interface ChatState {
  chatHistory: Message[];
  sessionId: string | null;
  isGenerating: boolean;
}

const initialState: ChatState = {
  chatHistory: [],
  sessionId: null,
  isGenerating: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.chatHistory.push(action.payload);
    },
    setSessionId: (state, action: PayloadAction<string | null>) => {
      state.sessionId = action.payload;
    },
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    resetChat: (state) => {
      state.chatHistory = [];
      state.sessionId = null;
      state.isGenerating = false;
    },
  },
});

export const { addMessage, setSessionId, setIsGenerating, resetChat } =
  chatSlice.actions;
export default chatSlice.reducer;
