import React from 'react';
import { AITool } from '@/lib/ai-tools';
import { Button } from '@/design-system/components/Button';

interface AIToolbarProps {
  onToolSelect: (tool: AITool) => void;
  activeTool?: AITool;
  disabled?: boolean;
}

export const AIToolbar: React.FC<AIToolbarProps> = ({
  onToolSelect,
  activeTool,
  disabled = false,
}) => {
  const tools: Array<{ id: AITool; label: string; icon: string; description: string }> = [
    {
      id: 'generate_section',
      label: 'Generate',
      icon: '✨',
      description: 'Generate new content for this section',
    },
    {
      id: 'regenerate_section',
      label: 'Regenerate',
      icon: '🔄',
      description: 'Regenerate the section content',
    },
    {
      id: 'rewrite_section',
      label: 'Rewrite',
      icon: '✏️',
      description: 'Rewrite with specific instructions',
    },
    {
      id: 'expand_section',
      label: 'Expand',
      icon: '📖',
      description: 'Add more detail and depth',
    },
    {
      id: 'shorten_section',
      label: 'Shorten',
      icon: '📝',
      description: 'Condense the content',
    },
    {
      id: 'improve_grammar',
      label: 'Improve Grammar',
      icon: '🔧',
      description: 'Fix grammar and clarity',
    },
    {
      id: 'analyze_section',
      label: 'Analyze',
      icon: '🔍',
      description: 'Analyze quality and completeness',
    },
    {
      id: 'use_logbook_data',
      label: 'Use Logbook',
      icon: '📋',
      description: 'Incorporate logbook entries',
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        AI Tools
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            disabled={disabled}
            title={tool.description}
            variant={activeTool === tool.id ? 'primary' : 'ghost'}
            size="sm"
            className="flex-col gap-1"
          >
            <span className="text-2xl">{tool.icon}</span>
            <span className="text-xs font-medium">{tool.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
