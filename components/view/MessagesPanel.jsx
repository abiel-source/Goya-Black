"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

// actions
import getConversations from "@/app/actions/messaging/getConversations";
import searchUsers from "@/app/actions/messaging/searchUsers";
import getMessages from "@/app/actions/messaging/getMessages";
import createConversation from "@/app/actions/messaging/createConversation";
import sendMessage from "@/app/actions/messaging/sendMessage";

export default function MessagesPanel() {
  const { data: session, status } = useSession();
  const myId = session?.user?.id;

  const [query, setQuery] = useState("");

  // Left: inbox + user search
  const [conversations, setConversations] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);

  const [userResults, setUserResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Right: active thread
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeOtherUser, setActiveOtherUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // auto scroll down to bottom of messages
  const messagesEndRef = useRef(null);

  // Message Composer
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  //////////////////////////////////////////////////////////////////////
  // Load inbox conversations on mount
  //////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (status !== "authenticated") {
      setLoadingConvos(false);
      return;
    }

    setLoadingConvos(true);
    (async () => {
      try {
        const res = await getConversations();
        setConversations(res?.conversations || []);
      } catch (e) {
        toast.error(e?.message || "Failed to load conversations");
      } finally {
        setLoadingConvos(false);
      }
    })();
  }, [status]);

  //////////////////////////////////////////////////////////////////////
  // Search users (debounced) when query has text
  //////////////////////////////////////////////////////////////////////
  const searchTimer = useRef(null);

  useEffect(() => {
    // REVISION: Let unauthenticated users still search
    // if (status !== "authenticated") return;

    const q = query.trim();
    if (!q) {
      setUserResults([]);
      setLoadingUsers(false);
      return;
    }

    setLoadingUsers(true);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await searchUsers(q);
        setUserResults(res?.users || []);
      } catch (e) {
        toast.error(e?.message || "Failed to search users");
      } finally {
        setLoadingUsers(false);
      }
    }, 500);

    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query, status]);

  //////////////////////////////////////////////////////////////////////
  // Load messages when activeConversationId changes
  //////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    (async () => {
      try {
        const res = await getMessages(activeConversationId, 50);
        setMessages(res?.messages || []);
      } catch (e) {
        toast.error(e?.message || "Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    })();
  }, [activeConversationId, status]);

  //////////////////////////////////////////////////////////////////////
  // Auto scroll down to bottom of conversation
  //////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [messages]);

  //////////////////////////////////////////////////////////////////////
  // Helpers
  //////////////////////////////////////////////////////////////////////
  const convoList = useMemo(() => conversations || [], [conversations]);

  const getOtherUserFromConvo = (convo) => {
    const parts = convo?.participants || [];
    return parts.find((p) => p?._id?.toString?.() !== myId?.toString?.());
  };

  // Find an existing conversationId with a given other user, using state only.
  const findConversationIdInStateByUserId = (otherUserId) => {
    if (!otherUserId) return null;

    for (const c of convoList) {
      const parts = c?.participants || [];
      const hasMe = parts.some(
        (p) => (p?._id?.toString?.() ?? p?._id) === (myId?.toString?.() ?? myId)
      );
      if (!hasMe) continue;

      const other = parts.find(
        (p) =>
          (p?._id?.toString?.() ?? p?._id) ===
          (otherUserId?.toString?.() ?? otherUserId)
      );
      if (other) return c?._id?.toString?.() ?? c?._id ?? null;
    }

    return null;
  };

  //////////////////////////////////////////////////////////////////////
  // Click a user in search results:
  // - DO NOT create a conversation
  // - If it exists in state, open it
  // - Otherwise open "draft thread" (activeOtherUser set, convoId null)
  //////////////////////////////////////////////////////////////////////
  const openChatWithUser = (user) => {
    if (!user?._id) return;
    if (status !== "authenticated") return toast.error("Sign in to message");

    setActiveOtherUser(user);

    const existingId = findConversationIdInStateByUserId(user._id);
    setActiveConversationId(existingId); // might be null -> draft thread

    // clear search so the inbox shows again
    setQuery("");
    setUserResults([]);
  };

  //////////////////////////////////////////////////////////////////////
  // Click a conversation in inbox list:
  //////////////////////////////////////////////////////////////////////
  const openConversation = (convo) => {
    const id = convo?._id?.toString?.() ?? convo?._id ?? null;
    setActiveConversationId(id);
    setActiveOtherUser(getOtherUserFromConvo(convo) || null);
  };

  //////////////////////////////////////////////////////////////////////
  // Send message (separate create + send)
  //////////////////////////////////////////////////////////////////////
  const handleSend = async () => {
    if (status !== "authenticated") {
      toast.error("Sign in to message");
      return;
    }

    const text = draft.trim();
    if (!text) return;

    setSending(true);

    try {
      let convoId = activeConversationId;

      // If no active conversation, try to find it from state using activeOtherUser
      if (!convoId && activeOtherUser?._id) {
        convoId = findConversationIdInStateByUserId(activeOtherUser._id);
      }

      // local state tells us that conversation does not exist
      // QUERY DATABASE FOR SOURCE OF TRUTH *********************************
      // local state check is fast - good
      // but we should do one final source-of-truth check before creating a convo
      if (!convoId) {
        // check database for conversation
      }

      // local state + source-of-truth tells us that conversation does not exist - create new
      if (!convoId) {
        if (!activeOtherUser?._id) {
          throw new Error("Select a user to message");
        }
        const created = await createConversation(activeOtherUser._id);
        convoId = created?.conversationId;
        if (!convoId) throw new Error("Failed to create conversation");

        // now that it exists, set it active
        setActiveConversationId(convoId);
      }

      // Send message into the (now known) conversation
      const res = await sendMessage(convoId, text);
      const newMsg = res?.message;

      // optimistic append
      if (newMsg) setMessages((prev) => [...prev, newMsg]);
      setDraft("");

      // refresh inbox ordering/preview so it appears at top
      const convosRes = await getConversations();
      setConversations(convosRes?.conversations || []);
    } catch (e) {
      toast.error(e?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const showUserSearch = query.trim().length > 0;

  return (
    <div className="h-full min-h-0 grid grid-cols-1 md:grid-cols-[340px_1fr]">
      {/* LEFT */}
      <div className="border-b md:border-b-0 md:border-r border-[#E5E7EB] bg-white flex flex-col min-h-0">
        {/* Search */}
        <div className="p-3 border-b border-[#E5E7EB]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people..."
            className="
              w-full rounded-xl bg-[#F9F9F7] border border-[#E5E7EB]
              px-3 py-2 text-sm text-[#111111] placeholder:text-zinc-400
              outline-none focus:border-[#2D6A4F]
              transition-colors duration-150
            "
          />
          <div className="mt-2 text-xs text-zinc-400">
            Search users to start or resume a chat.
          </div>
        </div>

        {/* Scrollable list area */}
        <div className="flex-1 min-h-0 overflow-auto">
          {showUserSearch ? (
            <div className="p-2">
              {loadingUsers ? (
                <div className="p-3 text-sm text-zinc-400">Searching...</div>
              ) : userResults.length === 0 ? (
                <div className="p-3 text-sm text-zinc-400">No users found.</div>
              ) : (
                <ul className="space-y-1">
                  {userResults.map((u) => (
                    <li key={u._id}>
                      <button
                        type="button"
                        onClick={() => openChatWithUser(u)}
                        className="w-full rounded-xl px-3 py-2 text-left hover:bg-zinc-50 transition-colors duration-150"
                      >
                        <div className="text-sm text-[#111111]">{u.username}</div>
                        <div className="text-xs text-zinc-400 truncate">Open chat</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="p-2">
              {loadingConvos ? (
                <div className="p-3 text-sm text-zinc-400">Loading...</div>
              ) : convoList.length === 0 ? (
                <div className="p-3 text-sm text-zinc-400">No conversations yet.</div>
              ) : (
                <ul className="space-y-1">
                  {convoList.map((c) => {
                    const id = c?._id?.toString?.() ?? c?._id;
                    const active = id === activeConversationId;
                    const other = getOtherUserFromConvo(c);
                    const title = other?.username || "Conversation";

                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => openConversation(c)}
                          className={`w-full text-left rounded-xl px-3 py-2 transition-colors duration-150 ${
                            active ? "bg-[#2D6A4F]/10" : "hover:bg-zinc-50"
                          }`}
                        >
                          <div className="text-sm text-[#111111]">{title}</div>
                          <div className="text-xs text-zinc-400 truncate">
                            {c.lastMessagePreview || "No messages yet"}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white flex flex-col min-h-0">
        {!activeOtherUser && !activeConversationId ? (
          <div className="h-full grid place-items-center p-6">
            <div className="text-center">
              <div className="text-[#111111] font-semibold">Select a chat</div>
              <div className="mt-2 text-sm text-zinc-400 max-w-md">
                Search for a user on the left to start a conversation.
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col min-h-0">
            {/* Thread header */}
            <div className="px-4 py-3 border-b border-[#E5E7EB]">
              <div className="text-[#111111] font-semibold">
                {activeOtherUser?.username || "Conversation"}
              </div>
              <div className="text-xs text-zinc-400">
                {activeConversationId ? "Active thread" : "New message"}
              </div>
            </div>

            {/* Messages (scrollable) */}
            <div ref={messagesEndRef} className="flex-1 min-h-0 overflow-auto p-4">
              {activeConversationId ? (
                loadingMessages ? (
                  <div className="text-sm text-zinc-400">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-sm text-zinc-400">No messages yet.</div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((m) => {
                      const mine =
                        (m.senderId?.toString?.() ?? m.senderId) ===
                        (myId?.toString?.() ?? myId);

                      return (
                        <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                              mine
                                ? "bg-[#2D6A4F] text-white"
                                : "bg-zinc-100 text-[#111111]"
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="text-sm text-zinc-400">Say hi to start the conversation.</div>
              )}
            </div>

            {/* Composer */}
            <div className="p-3 border-t border-[#E5E7EB]">
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="
                    flex-1 rounded-xl bg-[#F9F9F7] border border-[#E5E7EB]
                    px-3 py-2 text-sm text-[#111111] placeholder:text-zinc-400
                    outline-none focus:border-[#2D6A4F]
                    transition-colors duration-150
                  "
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || draft.trim().length === 0}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-white bg-[#2D6A4F] hover:bg-[#235C43] disabled:opacity-50 transition-colors duration-150"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>

              {!activeConversationId && (
                <div className="mt-2 text-xs text-zinc-400">
                  Conversation will be created when you send your first message.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
