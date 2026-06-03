"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Bike as BikeIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  getOrCreateConversation,
  sendMessage,
  type Conversation,
} from "@/lib/messageStore";

interface Props {
  open: boolean;
  onClose: () => void;
  agency: { id: string; name: string; response_time?: string };
  bike: { id: string; name: string };
}

export function MessageModal({ open, onClose, agency, bike }: Props) {
  const [convo, setConvo] = useState<Conversation | null>(null);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const c = getOrCreateConversation(agency.id, agency.name, bike.id, bike.name);
    // Seed an auto-reply if fresh conversation
    if (c.messages.length === 0) {
      const reply = sendMessage(
        c.id,
        "agency",
        `Hi! Thanks for reaching out about the ${bike.name}. ${agency.response_time ? `We typically respond within ${agency.response_time}.` : "We'll get back to you shortly!"} How can we help?`
      );
      setConvo(reply);
    } else {
      setConvo(c);
    }
  }, [open, agency.id, agency.name, bike.id, bike.name, agency.response_time]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convo?.messages.length]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !convo) return;
    const updated = sendMessage(convo.id, "renter", trimmed);
    setConvo(updated);
    setText("");

    // Simulate agency typing + reply after delay
    setTimeout(() => {
      const autoReplies = [
        "Thanks for your message! We'll confirm availability shortly.",
        "Great choice! Feel free to proceed with the booking and we'll approve it ASAP.",
        "We have the bike ready. Please bring a valid ID and your driver's license on pickup day.",
        "Any other questions? We're happy to help!",
      ];
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const withReply = sendMessage(convo.id, "agency", reply);
      setConvo(withReply);
    }, 1500);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface-2 flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center">
            <BikeIcon className="h-4 w-4 text-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{agency.name}</p>
            <p className="text-xs text-muted-foreground truncate">Re: {bike.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {convo?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "renter" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === "renter"
                    ? "bg-brand text-white rounded-br-sm"
                    : "bg-surface-3 text-foreground rounded-bl-sm"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "renter" ? "text-white/60 text-right" : "text-muted-foreground"
                  }`}
                >
                  {format(parseISO(msg.created_at), "h:mm a")}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 px-4 py-3 border-t border-border bg-surface-2 flex-shrink-0"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-lg border border-border bg-surface-3 px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <Button type="submit" size="sm" disabled={!text.trim()} className="gap-1.5">
            <Send className="h-3.5 w-3.5" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
