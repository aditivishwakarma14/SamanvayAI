import React, { useEffect, useState } from "react";

import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftIcon,
  PanelRight,
  PenSquare,
  Plus,
  User,
  X,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { getConversations } from "../features/getConversation";
import { createConversation } from "../features/createConversation";
import logOut from "../features/logOut.js";
import BillingDrawer from "./BillingDrawer.jsx";

import {
  addConversation,
  setConversations,
  setSelectedConversation,
} from "../state/slices/conversation.slice.js";

import { setUserdata } from "../state/slices/userSlice.js";

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dispatch = useDispatch();

  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { userData } = useSelector((state) => state.user);

  // Fetch conversations
  useEffect(() => {
    if (!userData?.userId) {
      dispatch(setConversations([]));
      dispatch(setSelectedConversation(null));
      return;
    }

    let cancelled = false;

    const getConv = async () => {
      try {
        const data = await getConversations();

        if (!cancelled) {
          dispatch(setConversations(data ?? []));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch conversations:", error);
        }
      }
    };

    getConv();

    return () => {
      cancelled = true;
    };
  }, [dispatch, userData?.userId]);

  // Reset image error
  useEffect(() => {
    setImageError(false);
  }, [userData?.avatar]);

  // Create + select conversation
  const handleCreateConversation = async () => {
    try {
      const data = await createConversation();

      console.log("CREATED CONVERSATION:", data);

      if (!data?._id) {
        console.log("Conversation was not created");
        return;
      }

      dispatch(addConversation(data));
      dispatch(setSelectedConversation(data));

      // Close sidebar on mobile after creating chat
      setMobileOpen(false);

      console.log("SELECTED CONVERSATION:", data);
    } catch (error) {
      console.error("Create conversation error:", error);
    }
  };

  // Select conversation
  const handleSelectConversation = (conv) => {
    dispatch(setSelectedConversation(conv));

    // Close sidebar on mobile
    setMobileOpen(false);
  };

  // New chat
  const handleNewChat = () => {
    dispatch(setSelectedConversation(null));
    setMobileOpen(false);
  };

  // Check selected conversation
  useEffect(() => {
    console.log(
      "REDUX SELECTED CONVERSATION:",
      selectedConversation
    );
  }, [selectedConversation]);

  // Logout
  const handleLogout = async () => {
    try {
      await logOut();

      dispatch(setUserdata(null));
      dispatch(setConversations([]));
      dispatch(setSelectedConversation(null));
      setMobileOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Collapsed Sidebar - Desktop only
  if (collapsed) {
    return (
      <div
        className="
          hidden lg:flex
          flex-col items-center
          w-[56px] h-screen
          bg-[#0d0f14]
          border-r border-white/[0.06]
          py-4 gap-1 shrink-0
        "
      >
        {/* Expand */}
        <button
          className="
            flex items-center justify-center
            w-9 h-9 rounded-xl
            text-slate-500
            hover:text-slate-200
            hover:bg-white/[0.05]
            transition-colors duration-150
            bg-transparent border-none
            cursor-pointer mb-1
          "
          onClick={() => setCollapsed(false)}
        >
          <PanelRight size={18} />
        </button>

        {/* New Chat */}
        <button
          className="
            flex items-center justify-center
            w-9 h-9 rounded-xl
            text-slate-500
            hover:text-slate-200
            hover:bg-white/[0.05]
            transition-colors duration-150
            bg-transparent border-none
            cursor-pointer
          "
          onClick={handleNewChat}
        >
          <Plus size={17} />
        </button>

        {/* Conversations */}
        <div
          className="
            flex-1 min-h-0 w-full
            overflow-y-auto
            px-2.5 pt-5
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {conversations.map((conv) => {
            const isActive =
              selectedConversation?._id === conv?._id;

            return (
              <button
                key={conv._id}
                title={conv.title || "New Chat"}
                onClick={() => handleSelectConversation(conv)}
                className={`
                  flex items-center justify-center
                  w-full h-9
                  cursor-pointer mb-1
                  rounded-[10px] border
                  transition-colors duration-150
                  ${
                    isActive
                      ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                      : "bg-transparent border-transparent hover:bg-indigo-500/[0.18]"
                  }
                `}
              >
                <div
                  className={`
                    flex items-center justify-center
                    shrink-0 w-[28px] h-[28px]
                    rounded-lg
                    ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "bg-white/[0.05] text-slate-500"
                    }
                  `}
                >
                  <MessageSquare size={14} />
                </div>
              </button>
            );
          })}
        </div>

        {/* User */}
        <div className="relative shrink-0 mt-2">
          {userData?.avatar && !imageError ? (
            <img
              className="
                w-9 h-9 rounded-[10px]
                object-cover
                border-2 border-indigo-500/25
              "
              src={userData.avatar}
              alt="User avatar"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="
                w-9 h-9 rounded-[10px]
                bg-white/[0.06]
                flex items-center justify-center
              "
            >
              <User size={15} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="
          lg:hidden
          fixed top-3.5 left-4
          z-[60]
          flex items-center justify-center
          w-8 h-8
          rounded-lg
          bg-[#0d0f14]
          border border-white/[0.06]
          text-slate-400
          hover:text-slate-200
          hover:bg-white/[0.05]
          transition-colors duration-150
          cursor-pointer
        "
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={15} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            lg:hidden
            fixed inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
          "
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static
          inset-y-0 left-0
          z-50
          w-[270px]
          max-w-[85vw]
          h-screen
          shrink-0
          bg-[#07090C]
          border-r border-white/[0.06]
          transition-transform duration-250 ease-in-out

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="
              flex items-center gap-2.5
              px-4 py-4
              border-b border-white/[0.06]
            "
          >
            {/* Collapse - Desktop */}
            <button
              className="
                hidden lg:flex
                items-center justify-center
                w-7 h-7
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/[0.05]
                transition-colors duration-150
                bg-transparent
                border-none
                cursor-pointer
              "
              onClick={() => setCollapsed(true)}
            >
              <PanelLeftIcon size={18} />
            </button>

            {/* Close - Mobile */}
            <button
              className="
                lg:hidden
                flex items-center justify-center
                w-7 h-7
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/[0.05]
                transition-colors duration-150
                bg-transparent
                border-none
                cursor-pointer
              "
              onClick={() => setMobileOpen(false)}
            >
              <X size={17} />
            </button>

            {/* Logo */}
            <span
              className="
                text-[16px]
                font-semibold
                text-slate-100
                tracking-tight
                flex-1
              "
            >
              SamanvayAI
            </span>

            {/* Plan */}
            <span
              className="
                text-[10px]
                font-medium
                text-indigo-400
                bg-indigo-500/10
                border border-indigo-500/20
                px-2 py-0.5
                rounded-full
                tracking-wide
              "
            >
              {userData?.plan || "Free"}
            </span>

            {/* New Chat Icon */}
            <button
              className="
                flex items-center justify-center
                w-7 h-7
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/[0.05]
                transition-colors duration-150
                bg-transparent
                border-none
                cursor-pointer
              "
              onClick={handleNewChat}
            >
              <PenSquare size={16} />
            </button>
          </div>

          {/* New Chat */}
          <div className="px-4 pt-4 pb-1">
            <button
              className="
                w-full
                flex items-center justify-center
                gap-2
                text-sm
                font-medium
                text-[#8ea2ff]
                bg-indigo-500/10
                border border-[#35458A]
                rounded-xl
                py-[10px]
                cursor-pointer
                hover:bg-[#161D38]
                hover:text-[#A8B6FF]
                hover:border-[#4B5FC4]
                transition-colors duration-150
              "
              onClick={handleNewChat}
            >
              <Plus size={15} />
              New Chat
            </button>
          </div>

          {/* Recents */}
          <div
            className="
              px-5 pt-4 pb-1.5
              text-[10.5px]
              font-semibold
              uppercase
              tracking-widest
              text-slate-600
              text-center
            "
          >
            {conversations.length === 0
              ? "No Recent Conversations"
              : "Recents"}
          </div>

          {/* Conversations */}
          <div
            className="
              flex-1
              min-h-0
              overflow-y-auto
              px-2.5
              pb-2
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {conversations.map((conv) => {
              const isActive =
                selectedConversation?._id === conv?._id;

              return (
                <button
                  key={conv._id}
                  onClick={() =>
                    handleSelectConversation(conv)
                  }
                  className={`
                    w-full
                    flex items-center
                    gap-2.5
                    text-left
                    cursor-pointer
                    mb-0.5
                    px-3 py-2
                    rounded-[10px]
                    border
                    transition-colors duration-150

                    ${
                      isActive
                        ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                        : "bg-transparent border-transparent hover:bg-indigo-500/[0.18]"
                    }
                  `}
                >
                  <div
                    className={`
                      flex items-center justify-center
                      shrink-0
                      w-[28px] h-[28px]
                      rounded-lg

                      ${
                        isActive
                          ? "bg-indigo-500/15 text-indigo-400"
                          : "bg-white/[0.05] text-slate-500"
                      }
                    `}
                  >
                    <MessageSquare size={14} />
                  </div>

                  <span
                    className={`
                      text-[13px]
                      font-medium
                      truncate
                      min-w-0

                      ${
                        isActive
                          ? "text-slate-100"
                          : "text-slate-300"
                      }
                    `}
                  >
                    {conv.title || "New Chat"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mx-2.5 h-px bg-white/[0.06]" />

          {/* User */}
          <div className="px-3.5 py-3.5">
            {userData ? (
              <div
                className="
                  flex items-center
                  gap-2.5
                  rounded-xl
                  px-3 py-2.5
                  hover:bg-white/[0.05]
                  transition-colors duration-150
                "
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {userData?.avatar && !imageError ? (
                    <img
                      className="
                        w-9 h-9
                        rounded-[10px]
                        object-cover
                        border-2
                        border-indigo-500/25
                      "
                      src={userData.avatar}
                      alt="User avatar"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div
                      className="
                        w-9 h-9
                        rounded-[10px]
                        bg-white/[0.06]
                        flex items-center
                        justify-center
                      "
                    >
                      <User
                        size={15}
                        className="text-slate-400"
                      />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="
                      text-[13px]
                      font-semibold
                      text-slate-100
                      truncate
                    "
                  >
                    {userData?.name || "User"}
                  </p>

                  <p className="text-[11px] text-slate-600 mt-px">
                    {userData?.plan || "Free Plan"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  {/* Billing */}
                  <button
                    onClick={() => setShowBilling(true)}
                    className="
                      flex items-center justify-center
                      w-7 h-7
                      rounded-[7px]
                      border-none
                      bg-transparent
                      text-yellow-600
                      cursor-pointer
                      hover:bg-white/[0.08]
                      hover:text-slate-400
                      transition-all duration-150
                    "
                  >
                    <Coins size={16} />
                  </button>

                  {/* Logout */}
                  <button
                    className="
                      flex items-center justify-center
                      w-7 h-7
                      rounded-[7px]
                      border-none
                      bg-transparent
                      text-slate-600
                      cursor-pointer
                      hover:bg-white/[0.08]
                      hover:text-slate-400
                      transition-all duration-150
                    "
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="
                  w-full
                  flex items-center
                  justify-center
                  gap-2
                  text-sm
                  font-medium
                  text-slate-200
                  bg-white/[0.05]
                  border border-white/[0.08]
                  rounded-xl
                  py-[11px]
                  cursor-pointer
                  hover:bg-white/[0.08]
                  transition-colors duration-150
                "
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Billing Drawer */}
      <BillingDrawer
        open={showBilling}
        onClose={() => setShowBilling(false)}
      />
    </>
  );
}

export default SideBar;