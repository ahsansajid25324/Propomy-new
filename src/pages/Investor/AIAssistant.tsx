import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../styles/AIAssistant.css";
import { useMutation } from "@apollo/client/react";
import type { Message, ChatWithAIResponse } from "../../types/ChatBot";
import { CHAT_WITH_AI } from "../../apollo/graphql/mutations/ChatBot";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { updateUser } from "../../features/auth/authSlice";
import {
  addMessage,
  setSessionId,
  setIsGenerating,
  resetChat,
} from "../../features/chat/chatSlice";

const LOADING_MESSAGES = [
  "Thinking...",
  "Searching properties...",
  "Analyzing details...",
  "Preparing results...",
];

export const AIAssistant = () => {
  const dispatch = useDispatch();

  // Auth State
  const user = useSelector((state: RootState) => state.auth.user);
  const chatLimit = user?.chatApiLimit ?? 0;

  const { chatHistory, sessionId, isGenerating } = useSelector(
    (state: RootState) => state.chat,
  );

  const [input, setInput] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // GraphQL Mutation
  const [sendMessage, { loading: mutationLoading }] =
    useMutation<ChatWithAIResponse>(CHAT_WITH_AI, {
      onCompleted: (data) => {
        const {
          message: aiMessage,
          sessionId: newSessionId,
          chatApiLimit: newLimit,
        } = data.chatWithAI;

        if (newLimit !== undefined) {
          dispatch(updateUser({ chatApiLimit: newLimit }));
        }

        const newAiMessage: Message = {
          role: "assistant",
          text: aiMessage,
          id: Date.now() + 1,
        };

        dispatch(addMessage(newAiMessage));

        if (newSessionId) {
          dispatch(setSessionId(newSessionId));
        }

        dispatch(setIsGenerating(false));
      },
      onError: (error) => {
        const errorMessage: Message = {
          role: "assistant",
          text:
            error.message ||
            "I'm sorry, I encountered an error. Please try again.",
          id: Date.now() + 1,
        };
        dispatch(addMessage(errorMessage));
        dispatch(setIsGenerating(false));
      },
    });

  const isLoading = isGenerating || mutationLoading;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prevStep) =>
          prevStep < LOADING_MESSAGES.length - 1 ? prevStep + 1 : prevStep,
        );
      }, 2500);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Scroll to bottom when history or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || chatLimit <= 0) return;

    const userMessage = input.trim();
    const newUserEntry: Message = {
      role: "user",
      text: userMessage,
      id: Date.now(),
    };

    dispatch(addMessage(newUserEntry));
    dispatch(setIsGenerating(true));
    setInput("");

    await sendMessage({
      variables: {
        message: userMessage,
        sessionId: sessionId,
      },
    });
  };

  const handleReset = () => {
    dispatch(resetChat());
  };

  return (
    <div className="chat-page-wrapper">
      {chatHistory.length === 0 ? (
        <div className="empty-hero-container">
          <div className="text-center">
            <h1 className="fw-bold display-5">
              Hey {user?.firstName || "User"}!
            </h1>
            <p className="text-muted fs-5">
              Can I help you with anything today?
            </p>
            {chatLimit <= 0 && (
              <div className="badge bg-danger-subtle text-danger p-2 mt-2">
                Limit Reached! Please upgrade to continue chatting.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="active-chat-header border-bottom bg-white px-4 py-3 d-flex justify-content-between align-items-center sticky-top">
          <div className="d-flex align-items-center gap-3">
            <div className={`chat-credit-badge ${chatLimit < 5 ? "low" : ""}`}>
              <span className="credit-dot"></span>
              {chatLimit} Credits left
            </div>
          </div>
          <button
            className="btn btn-outline-danger btn-sm rounded-pill px-3"
            onClick={handleReset}
          >
            Reset Chat
          </button>
        </div>
      )}

      <div className="chat-content-area py-2 py-md-4">
        <div className="container" style={{ maxWidth: "1000px" }}>
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`message-wrapper mb-4 ${msg.role === "user" ? "user-align" : "ai-align"}`}
            >
              {msg.role === "user" ? (
                <div className="user-bubble shadow-sm">{msg.text}</div>
              ) : (
                <div className="ai-card p-4 rounded-4 shadow-sm bg-white border">
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Dynamic Rotating Loading Indicator */}
          {isLoading && (
            <div className="ai-align mb-4">
              <div className="ai-card loading p-3 px-4 rounded-4 shadow-sm border bg-light d-inline-flex align-items-center gap-3">
                <span
                  className="spinner-border spinner-border-sm text-primary"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="text-muted fw-medium fs-6 loading-text">
                  {LOADING_MESSAGES[loadingStep]}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-sticky-footer bg-white border-top py-3">
        <div className="container" style={{ maxWidth: "750px" }}>
          <div
            className={`chat-input-pill shadow-sm d-flex align-items-end ${chatLimit <= 0 ? "limit-reached-pill" : ""}`}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              className="form-control border-0 bg-transparent px-3 fs-5 custom-textarea"
              placeholder={
                chatLimit <= 0
                  ? "You have reached your limit..."
                  : "Please enter prompt here..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading || chatLimit <= 0}
            />
            <button
              className="btn btn-primary send-pill-btn px-4 py-2 fw-bold mb-1"
              onClick={handleSend}
              disabled={isLoading || !input.trim() || chatLimit <= 0}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
