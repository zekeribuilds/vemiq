'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import PageContainer from '@/components/layout/PageContainer';
import { SendIcon, MicIcon, CameraIcon, UploadIcon, SparklesIcon, DocumentsIcon, OrganizationIcon, ChevronDownIcon, XIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';
import { suggestedPrompts } from '@/lib/chat-prompts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function DashboardChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportContext, setReportContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch most recent report for context
        const { data: reportsData } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (reportsData && reportsData.length > 0) {
          setReportContext({
            name: reportsData[0].title,
            institution: reportsData[0].institution,
            pages: reportsData[0].progress || 0,
          });
          setShowContext(true);
        }

        // Fetch chat history if exists
        const { data: chatData } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(50);

        if (chatData && chatData.length > 0) {
          setMessages(chatData.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          })));
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error('Error fetching chat data:', err);
      }
    };

    fetchData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: reportContext,
          history: messages,
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error processing your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Vemiq Assistant</h1>
            <p className="text-muted-foreground">AI-powered report generation</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <SparklesIcon size={24} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Report Context */}
      {showContext && reportContext && (
        <Card className="rounded-24 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <DocumentsIcon size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{reportContext.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <OrganizationIcon size={12} />
                  <span>{reportContext.institution || 'Not specified'}</span>
                  <span>•</span>
                  <span>{reportContext.pages} pages</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowContext(false)}
              variant="ghost"
              size="sm"
              leftIcon={<XIcon size={16} />}
            />
          </div>
        </Card>
      )}

      {/* Messages Area */}
      <Card className="rounded-24 p-6 mb-6 h-[500px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground border border-border'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Suggested Prompts */}
      {showSuggestions && messages.length === 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">Suggested actions</p>
          <div className="grid grid-cols-2 gap-3">
            {suggestedPrompts.map((prompt) => (
              <Button
                key={prompt.id}
                onClick={() => {
                  setInput(prompt.label);
                  setShowSuggestions(false);
                }}
                variant="secondary"
                size="md"
                className="text-left"
              >
                {prompt.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Composer */}
      <Card className="rounded-24 p-4">
        <div className="flex items-center gap-3">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" leftIcon={<MicIcon size={18} />} />
            <Button variant="ghost" size="sm" leftIcon={<CameraIcon size={18} />} />
            <Button variant="ghost" size="sm" leftIcon={<UploadIcon size={18} />} />
          </div>

          {/* Input */}
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
          />

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            size="md"
            isLoading={loading}
            leftIcon={!loading ? <SendIcon size={18} /> : undefined}
          />
        </div>
      </Card>
    </PageContainer>
  );
}
