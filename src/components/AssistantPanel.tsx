"use client";

import { X, PaperPlaneRight, ArrowsOutSimple, ArrowsInSimple } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import { useAssistantPanel } from "@/contexts/AssistantPanelContext";
import { usePalette } from "@/contexts/PaletteContext";

type Message = { role: "user" | "assistant"; content: string };

const WELCOME: Message = {
  role: "assistant",
  content: "Hi! I'm your AI assistant. How can I help you today?",
};

export function AssistantPanel() {
  const { isOpen, isExpanded, close, toggleExpanded } = useAssistantPanel();
  const { surfaceColors: sc } = usePalette();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hasOpened.current = true;
      const t = setTimeout(() => {
        setMessages([WELCOME]);
      }, 350);
      return () => clearTimeout(t);
    } else {
      // reset when closed
      setMessages([]);
      setInput("");
      hasOpened.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm still learning, but I'll do my best to help!" }]);
    }, 800);
  };

  return (
    <div
      className="absolute right-0 top-0 bottom-0 flex flex-col overflow-hidden rounded-2xl"
      style={{
        width: isExpanded ? "100%" : isOpen ? 500 : 0,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        background: sc.panel,
        transition: "width 300ms ease-in-out, opacity 300ms ease-in-out",
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col" style={{ minWidth: 0 }}>
        {/* Header */}
        <div className="relative flex h-[60px] shrink-0 items-center justify-between px-4">
          {/* Animated gradient line */}
          <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
            <div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, transparent 0%, #a855f7 25%, #3b82f6 50%, #ec4899 75%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "assistantLine 3s ease-in-out infinite",
              }}
            />
          </div>
          <span className="text-sm font-semibold text-fg">Assistant</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleExpanded}
              className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg"
            >
              {isExpanded
                ? <ArrowsInSimple weight="bold" size={14} />
                : <ArrowsOutSimple weight="bold" size={14} />
              }
            </button>
            <button
              type="button"
              onClick={close}
              className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg"
            >
              <X weight="bold" size={14} />
            </button>
          </div>
        </div>
        <style>{`
          @keyframes assistantLine {
            0%   { background-position: 100% 0; opacity: 0.6; }
            50%  { background-position: 0% 0;   opacity: 1; }
            100% { background-position: -100% 0; opacity: 0.6; }
          }
          @keyframes msgFloatUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Messages */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className={`flex flex-1 flex-col gap-3 px-4 py-4 ${isExpanded ? "mx-auto w-full" : ""}`} style={isExpanded ? { maxWidth: 800 } : undefined}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              style={{ animation: "msgFloatUp 0.3s cubic-bezier(0.16,1,0.3,1) both" }}
            >
              <div
                className="max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed"
                style={{
                  background: msg.role === "user" ? "var(--selected)" : sc.card,
                  color: "var(--surface-foreground-0)",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        </div>

        {/* Input */}
        <div className="shrink-0 px-3 pb-3">
          <div className={isExpanded ? "mx-auto w-full" : ""} style={isExpanded ? { maxWidth: 800 } : undefined}>
          <div
            className="flex flex-col gap-2 rounded-xl p-3"
            style={{ height: 160, background: sc.card, border: "1px solid var(--surface-border-alpha-0)" }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything…"
              className="min-h-0 flex-1 resize-none bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
            />
            <div className="flex shrink-0 justify-end">
              <button
                type="button"
                onClick={send}
                disabled={!input.trim()}
                className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:opacity-30"
                style={{ background: "var(--selected)" }}
              >
                <PaperPlaneRight weight="bold" size={11} className="text-fg" />
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
