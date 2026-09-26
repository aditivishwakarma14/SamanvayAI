import { Paperclip, Mic, Send } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import sendMessage from "../features/sendMessage";
import { createConversation } from "../features/createConversation";
import { setSelectConversation } from "../state/slices/conversation.slice.js";

function ChatInput() {
  const [value, setValue] = useState("");

  const dispatch = useDispatch();

  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const handleSendMessage = async () => {
    console.log("VALUE:", value);
    console.log("SELECTED CONVERSATION:", selectedConversation);

    if (!value.trim()) return;

    let conversation = selectedConversation;

    // Agar conversation select nahi hai
    if (!conversation?._id) {
      console.log("NO CONVERSATION → CREATING NEW ONE");

      conversation = await createConversation();

      console.log("CREATED CONVERSATION:", conversation);

      if (!conversation?._id) {
        console.log("CONVERSATION CREATION FAILED");
        return;
      }

      dispatch(setSelectConversation(conversation));
    }

    // Backend ke according payload
   const payload = {
  conversationId: conversation._id,
  prompt: value.trim(),
};

    console.log("PAYLOAD:", payload);

    const data = await sendMessage(payload);

    console.log("RESPONSE:", data);

    if (data) {
      setValue("");
    }
  };

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#07090C]">

      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">

        {/* Textarea */}
        <textarea
          placeholder="Ask Anything..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="bg-transparent outline-none resize-none text-[14px] placeholder:text-slate-600 leading-relaxed disabled:opacity-50 text-slate-200 w-full"
          rows={3}
        />

        {/* Bottom Controls */}
        <div className="flex items-center justify-between">

          {/* Left buttons */}
          <div className="flex items-center gap-1">

            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 border border-transparent transition-all duration-150 bg-transparent cursor-pointer"
            >
              <Paperclip size={16} />
            </button>

            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 border border-transparent transition-all duration-150 bg-transparent cursor-pointer"
            >
              <Mic size={16} />
            </button>

          </div>

          {/* Send */}
          <button
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