import React from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import LoadingAnimation from "./LoadingAnimation";

function MessageList() {
  const { messages, isLoading } = useSelector(
    (state) => state.message
  );

  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const isEmpty = !selectedConversation || !messages?.length;

  return (
    <div
      className="
        flex-1
        overflow-y-auto
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-[#4A4A4A]
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-[#5A5A5A]
      "
    >
      {isEmpty ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[20px] font-semibold text-slate-200 tracking-tight">
              SamanvayAI
            </h1>

            <p className="text-[15px] font-semibold text-slate-400 tracking-tight">
              How can I help you?
            </p>

            <p className="text-[13px] text-slate-600 max-w-[260px] leading-relaxed">
              Ask me anything - code, ideas, explanations, or just a quick question.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {[
              "Write a Netflix clone",
              "Explain Redis",
              "Build a dashboard",
            ].map((s) => (
              <button
                key={s}
                className="
                  text-[12px]
                  text-slate-400
                  bg-white/[0.04]
                  border border-white/[0.07]
                  px-3 py-1.5
                  rounded-lg
                  hover:bg-white/[0.08]
                  hover:text-slate-200
                  transition-colors
                  duration-150
                  cursor-pointer
                "
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5 px-6 py-6">
          {messages.map((msg, index) => (
            <div key={msg?._id || `${msg?.role}-${index}`}>
              <MessageBubble
                role={msg?.role}
                content={msg?.content}
                images={msg?.images || []}
              />
            </div>
          ))}

          {isLoading && <LoadingAnimation />}
        </div>
      )}
    </div>
  );
}

export default MessageList;