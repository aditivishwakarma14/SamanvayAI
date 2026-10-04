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
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts } from "../state/slices/messageSlice.js";
import { X } from "lucide-react";
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
  const [selectedFile, setSelectedFile] = useState(null);

  const fileRef = useRef(null);

  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    const prompt = value.trim();

    if (!prompt) return;

    let conversation = selectedConversation;

    // Create conversation if there is no selected conversation
    if (!conversation) {
      const conv = await createConversation();

      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv));

      conversation = conv;
    }

    // Update title for first message
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
        })
      );
    }

    const payload = {
      prompt,
      conversationId: conversation?._id,
      agent: selectedAgent.toLowerCase(),
    };
    
    const formData = new FormData()
    formData.append("prompt" , value.trim())
    formData.append("conversationId" ,conversation?._id )
    formData.append("agent" , selectedAgent.toLowerCase())
    formData.append("file" , selectedFile)


    // Show user message immediately
    dispatch(
      addMessage({
        role: "user",
        content: prompt,
      })
    );

    // Clear input
    setValue("");

    try {
      const data = await sendMessage(formData);
      setSelectedFile(null)

      console.log("🤖 AI RESPONSE FROM API:", data);

      dispatch(setArtifacts(data?.artifacts || []));

      dispatch(
        addMessage({
          role: "assistant",
          content: data?.answer || "No response received.",
          images: data?.images || [],
        })
      );
    } catch (error) {
      console.error("CHAT ERROR:", error);

      dispatch(
        addMessage({
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        })
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

        {/* Agent Selection */}
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
                      ? "bg-[#11162A] text-[#A8B6FF] border-[#35458A]"
                      : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                  }
                `}
              >
                <Icon
                  size={14}
                  className={
                    isActive ? "text-white" : "text-slate-500"
                  }
                />

                {agent.label}
              </div>
            );
          })}
        </div>

        
         {
                  selectedFile && <div className='my-3'>
        
                    <div className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2'>
                      {
                        selectedFile?.type === "application/pdf" ? <FileText size={16}
        
                          className="text-red-400"
                        /> : selectedFile.type.startsWith("image/") && <img src={URL.createObjectURL(selectedFile)} className="h-10 w-10 rounded-xl object-cover mt-3"
                        />
                      }
        
                      <div>
                        <p className='text-xs text-white'>
                          {selectedFile?.name}
                        </p>
                        <p className='text-[10px] text-slate-500'>
                          {Math.ceil(selectedFile.size)}KB
                        </p>
        
                      </div>
                      <button className='ml-2' onClick={() => { setSelectedFile(null); fileRef.current.value = "" }}><X size={14} className='text-slate-500 hover:text-white' /></button>
                    </div>
        
        
                  </div>
                }

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

          {/* Left Buttons */}
          <div className="flex items-center gap-1">

            <input
              type="file"
              accept=".pdf , image/*"
              hidden
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setSelectedFile(file);
                }
              }}
            />

            <button
              onClick={() => fileRef.current.click()}
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

          {/* Send Button */}
          <button
            type="button"
            disabled={!value.trim()}
            onClick={handleSendMessage}
            className={`
              flex items-center justify-center
              w-8 h-8
              rounded-lg
              transition-all duration-150

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