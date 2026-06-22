import React, { useState } from 'react';
import { AIToolbar } from './AIToolbar';
import { DraftWorkflow } from './DraftWorkflow';
import { AITool } from '@/lib/ai-tools';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatWorkspaceProps {
  reportId: string;
  sectionId?: string;
  sectionTitle?: string;
  onSectionUpdate?: (sectionId: string, content: string) => void;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  reportId,
  sectionId,
  sectionTitle,
  onSectionUpdate,
}) => {
  const [activeTool, setActiveTool] = useState<AITool | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [draftContent, setDraftContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDraft, setShowDraft] = useState(false);

  const handleToolSelect = (tool: AITool) => {
    setActiveTool(tool);
    // Add system message about selected tool
    const toolMessages: Record<AITool, string> = {
      generate_section: `✨ Generate mode selected. I'll generate content for "${sectionTitle || 'this section'}".`,
      regenerate_section: `🔄 Regenerate mode selected. I'll regenerate the content for "${sectionTitle || 'this section'}".`,
      rewrite_section: `✏️ Rewrite mode selected. Tell me how you'd like to rewrite this section.`,
      expand_section: `📖 Expand mode selected. I'll add more detail to this section.`,
      shorten_section: `📝 Shorten mode selected. I'll condense this section.`,
      improve_grammar: `🔧 Grammar improvement mode selected. I'll fix grammar and clarity.`,
      analyze_section: `🔍 Analyze mode selected. I'll analyze this section for quality.`,
      use_logbook_data: `📋 Logbook mode selected. I'll incorporate logbook entries into this section.`,
    };

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'system',
        content: toolMessages[tool],
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // TODO: Implement actual AI API call
    // For now, simulate a response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `[AI response for "${activeTool || 'general'}" mode]\n\nThis is a placeholder. In production, this would call the AI API with the full context including:\n- Student profile\n- Institution details\n- Organization knowledge\n- Linked logbook entries\n- Current section content`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);

      // If it's a generation tool, show draft
      if (activeTool === 'generate_section' || activeTool === 'regenerate_section') {
        setDraftContent(assistantMessage.content);
        setShowDraft(true);
      }
    }, 1000);
  };

  const handleAcceptDraft = (content: string) => {
    if (onSectionUpdate && sectionId) {
      onSectionUpdate(sectionId, content);
    }
    setShowDraft(false);
    setDraftContent('');
    setActiveTool(undefined);
  };

  const handleEditDraft = (content: string) => {
    setDraftContent(content);
  };

  const handleDiscardDraft = () => {
    setShowDraft(false);
    setDraftContent('');
  };

  const handleRegenerateDraft = () => {
    // Trigger regeneration
    handleSendMessage();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            AI Workspace
          </h2>
          {sectionTitle && (
            <span className="text-sm text-gray-600">
              Section: {sectionTitle}
            </span>
          )}
        </div>
        <AIToolbar
          onToolSelect={handleToolSelect}
          activeTool={activeTool}
          disabled={isGenerating}
        />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg mb-2">👋 Welcome to the AI Workspace</p>
            <p className="text-sm">
              Select a tool above or type a message to get started
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.role === 'system'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg p-3">
              <p className="text-sm">Generating...</p>
            </div>
          </div>
        )}
      </div>

      {/* Draft Workflow */}
      {showDraft && draftContent && (
        <div className="border-t border-gray-200 p-4">
          <DraftWorkflow
            draftContent={draftContent}
            onAccept={handleAcceptDraft}
            onEdit={handleEditDraft}
            onDiscard={handleDiscardDraft}
            onRegenerate={handleRegenerateDraft}
            isLoading={isGenerating}
          />
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              activeTool
                ? 'Add additional instructions...'
                : 'Type your message or select a tool above...'
            }
            disabled={isGenerating}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isGenerating || !inputValue.trim()}
            size="md"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
