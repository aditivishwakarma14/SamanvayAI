import {
  Paperclip,
  Mic,
  Send,
  Zap,
  MessageSquare,
  Code2,
  FileText,
  Presentation,
  ImageIcon,
  Globe,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../state/slices/messageSlice.js";

import sendMessage from "../features/sendMessage";
import { createConversation } from "../features/createConversation.js";

import {
  setSelectedConversation,
  addConversation,
  setConversationTitle,
} from "../state/slices/conversation.slice.js";

import { updateConversation } from "../features/updateConversation.js";

function ChatInput() {
  const [value, setValue] = useState("");

  const [selectedAgent, setSelectedAgent] = useState("Auto");

  const { selectedConversation } = useSelector((state) => state.conversation);

  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    // Current message
    const prompt = value.trim();

    // Empty message nahi bhejna
    if (!prompt) return;

    let conversation = selectedConversation;

    // Agar conversation nahi hai to create karo
    if (!conversation) {
      const conv = await createConversation();

      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv));

      conversation = conv;
    }

    // Agar first message hai to conversation title update karo
    if (conversation.title === "New Chat") {
      const title = prompt.slice(0, 40);

      await updateConversation({
        id: conversation._id,
        title,
      });

      dispatch(
        setConversationTitle({
          conversationId: conversation._id,
          title,
        }),
      );
    }

    const payload = {
      prompt : value.trim() ,
      conversationId: conversation._id,
      agent : selectedAgent.toLowerCase()

    };

    // User message immediately show karo
    dispatch(
      addMessage({
        role: "user",
        content: value.trim(),
      }),
    );

    // Input clear
    setValue("");

    try {
      const data = await sendMessage(payload);

      dispatch(
        addMessage({
          role: "assistant",
          content: data?.answer ,
          images :  data?.images 
        }),
        console.log(data)
      );
    } catch (error) {
      console.error("CHAT ERROR:", error);

      dispatch(
        addMessage({
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        }),
      );
    }
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
    {
      id: "image",
      icon: ImageIcon,
      label: "Image",
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
  ];

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#07090C]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label;
            const Icon = agent.icon;
            return (
              <div
               key={agent.id}
                onClick={() => setSelectedAgent(agent.label)}
                className={`
              flex-shrink-0
              cursor-pointer
                inline-flex items-center gap-1.5
                px-3 py-2
                rounded-full
                text-xs
                font-medium
                border
                transition-all

  ${
    isActive
      ? "bg-[#11162A] text-[#A8B6FF] border-[#35458A] ]"
      : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
  }
`}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-white" : "text-slate-500"}
                />
                {agent.label}
              </div>
            );
          })}
        </div>

        {/* Textarea */}
        <textarea
          placeholder="Ask Anything..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="bg-transparent outline-none resize-none text-[14px] placeholder:text-slate-600 leading-relaxed disabled:opacity-50 text-slate-200 w-full"
          rows={2}
        />

        {/* Bottom Controls */}
        <div className="flex items-center justify-between">
          {/* Left buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 border border-transparent transition-all duration-150 bg-transparent cursor-pointer"
            >
              <Paperclip size={16} />
            </button>

            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 border border-transparent transition-all duration-150 bg-transparent cursor-pointer"
            >
              <Mic size={16} />
            </button>
          </div>

          {/* Send */}
          <button
            type="button"
            disabled={!value.trim()}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 
              ${
                value.trim()
                  ? "text-[#8ea2ff] bg-indigo-500/10 border border-[#35458A] cursor-pointer hover:bg-[#161D38] hover:text-[#A8B6FF] hover:border-[#4B5FC4]"
                  : "text-slate-600 bg-white/[0.04] border border-transparent cursor-not-allowed"
              } 
            `}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
