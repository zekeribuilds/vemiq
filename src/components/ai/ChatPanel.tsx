'use client';

import { useState } from 'react';
import { SendIcon, RefreshCwIcon, SparklesIcon, MinusIcon, CreateIcon, GraduationCapIcon, SuccessIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';

interface ChatPanelProps {
  sectionId: string;
  sectionContent: string;
  onContentChange: (content: string) => void;
}

export default function ChatPanel({ sectionId, sectionContent, onContentChange }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const quickActions = [
    { icon: RefreshCwIcon, label: 'Rewrite', action: 'rewrite' },
    { icon: CreateIcon, label: 'Expand', action: 'expand' },
    { icon: MinusIcon, label: 'Shorten', action: 'shorten' },
    { icon: GraduationCapIcon, label: 'Formalize', action: 'formalize' },
    { icon: SuccessIcon, label: 'Fix Grammar', action: 'grammar' },
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setChatHistory((prev) => [...prev, { role: 'user', content: message }]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sectionContent,
          sectionId,
        }),
      });

      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);
      
      if (data.updatedContent) {
        onContentChange(data.updatedContent);
      }
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    setChatHistory((prev) => [
      ...prev,
      { role: 'user', content: `Apply ${action} action to this section` },
    ]);

    try {
      const response = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          content: sectionContent,
        }),
      });

      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);
      
      if (data.updatedContent) {
        onContentChange(data.updatedContent);
      }
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-primary flex items-center gap-2">
          <SparklesIcon size={20} className="text-success" />
          AI Assistant
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Edit this section with AI help</p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <p className="text-xs font-medium text-foreground mb-3">QUICK ACTIONS</p>
        <div className="grid grid-cols-5 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.action}
                onClick={() => handleQuickAction(action.action)}
                disabled={isLoading}
                variant="ghost"
                size="sm"
                leftIcon={<Icon size={18} className="text-muted-foreground" />}
                className="flex-col gap-1"
              >
                <span className="text-xs text-muted-foreground">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <SparklesIcon size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-sm">Ask me to help edit this section</p>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-md px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-md px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask AI to edit this section..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            size="md"
            leftIcon={<SendIcon size={20} />}
          />
        </div>
      </div>
    </div>
  );
}
