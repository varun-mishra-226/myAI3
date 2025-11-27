'use client';

import * as React from 'react';
import Image from 'next/image';
import { useChat } from '@ai-sdk/react';
type QuickAction = {
  label: string;
  prompt: string;
};

const quickActions: QuickAction[] = [
  {
    label: 'Fix tone of this LinkedIn post',
    prompt:
      'Make this LinkedIn post on-brand for BITSoM. Keep it confident, modern and approachable:\n\n',
  },
  {
    label: 'Check if my event poster copy is on-brand',
    prompt:
      'Review this event poster copy for brand alignment with BITSoM. Suggest corrections for tone, clarity and brand vocabulary:\n\n',
  },
  {
    label: 'Summarise logo & colour do’s/don’ts',
    prompt:
      'Give me a concise checklist of logo and colour usage do’s and don’ts for BITSoM collateral.',
  },
];

export default function HomePage() {
const { messages, sendMessage, status } = useChat();

const [input, setInput] = React.useState('');

const isLoading = status === "submitted";

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleQuickActionClick = (action: QuickAction) => {
    setInput(action.prompt);
  };

  return (
    <main className="bitsom-root">
      {/* Left rail: brand panel */}
      <aside className="bitsom-rail">
        <div className="bitsom-rail-inner">
          <div className="bitsom-logo-block">
            <div className="bitsom-logo-wrapper">
              <Image
                src="/bitsom-logo.png"
                alt="BITSoM logo"
                width={72}
                height={96}
                priority
              />
            </div>
            <div className="bitsom-brand-text">
              <p className="bitsom-tagline-eyebrow">BITS School of Management</p>
              <h1 className="bitsom-tagline-title">
                <span className="bitsom-onword">On</span>
                <span className="bitsom-brandword">Brand</span>
              </h1>
              <p className="bitsom-tagline-sub">
                Your on-brand content copilot for BITSoM — grounded in official
                brand guidelines, tone of voice and visual identity.
              </p>
            </div>
          </div>

          <div className="bitsom-panel-section">
            <h2 className="bitsom-panel-title">What can I help you with?</h2>
            <ul className="bitsom-panel-list">
              <li>Refine posts to match BITSoM tone of voice.</li>
              <li>Generate event + sponsor copy in brand colours & style.</li>
              <li>Explain logo, colour and typography do’s & don’ts.</li>
              <li>Draft image prompts aligned to BITSoM’s design language.</li>
            </ul>
          </div>

          <div className="bitsom-panel-section">
            <h3 className="bitsom-panel-subtitle">Quick actions</h3>
            <div className="bitsom-chips">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="bitsom-chip"
                  onClick={() => handleQuickActionClick(action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bitsom-panel-footer">
            <p className="bitsom-footer-small">
              Built for BITSoM students, clubs, committees, & admins to keep every touch
              point consistently on-brand.
            </p>
          </div>
        </div>
      </aside>

      {/* Right side: chat surface */}
      <section className="bitsom-chat-shell">
        <header className="bitsom-chat-header">
          <div>
            <p className="bitsom-chat-eyebrow">Brand Governance Copilot</p>
            <h2 className="bitsom-chat-title">BITSoM Brand Assistant</h2>
          </div>
          <button
            type="button"
            className="bitsom-clear-btn"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            disabled={messages.length === 0}
          >
            New chat
          </button>
        </header>

        <div className="bitsom-chat-body">
          {messages.length === 0 ? (
            <div className="bitsom-empty-state">
              <p className="bitsom-empty-title">
                Start with your draft, we’ll make it BITSoM.
              </p>
              <p className="bitsom-empty-sub">
                Paste a caption, email, or event description and ask the
                assistant to align it with BITSoM’s brand guidelines.
              </p>
            </div>
          ) : (
            <div className="bitsom-messages">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === 'user'
                      ? 'bitsom-message bitsom-message-user'
                      : 'bitsom-message bitsom-message-assistant'
                  }
                >
                  <div className="bitsom-message-meta">
                    <span className="bitsom-message-role">
                      {m.role === 'user' ? 'You' : 'Brand AI'}
                    </span>
                  </div>
                  <div className="bitsom-message-bubble">
                    {m.parts?.map((part, index) => {
                      if (part.type === 'text') {
                        return <span key={index}>{part.text}</span>;
                      }
                      // You can handle other part types (reasoning, tool, etc.) here if needed
                      return null;
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form
          className="bitsom-input-bar"
          onSubmit={async (e) => {
            e.preventDefault();
        
            if (!input.trim()) return;
        
            await sendMessage({
              text: input,
            });
        
            setInput("");
          }}
        >
          <textarea
            className="bitsom-input"
            placeholder="Paste your draft here and ask, e.g. “Make this LinkedIn post on-brand for BITSoM’s tone of voice.”"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            disabled={isLoading}
          />
        
          <div className="bitsom-input-footer">
            <span className="bitsom-input-hint">
              Tell me the output type — Tone of Voice, Brand Identity, Digital, Iconography, Stationery, or Other Collaterals (PPT Template, Bag, Mug, Pen & T-shirt) — for the most accurate suggestions.
            </span>
        
            <button
              type="submit"
              className="bitsom-send-btn"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? "Thinking…" : "Send"}
            </button>
          </div>
        </form>

      </section>
    </main>
  );
}
