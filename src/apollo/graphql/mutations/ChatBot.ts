import { gql } from "@apollo/client";

export const CHAT_WITH_AI = gql`
  mutation ChatWithAI($message: String!, $sessionId: String) {
    chatWithAI(message: $message, sessionId: $sessionId) {
      success
      message
      sessionId
      chatApiLimit
    }
  }
`;
