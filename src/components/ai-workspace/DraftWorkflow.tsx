import React, { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Textarea } from '@/design-system/components/Textarea';

interface DraftWorkflowProps {
  draftContent: string;
  onAccept: (content: string) => void;
  onEdit: (content: string) => void;
  onDiscard: () => void;
  onRegenerate: () => void;
  isLoading?: boolean;
}

export const DraftWorkflow: React.FC<DraftWorkflowProps> = ({
  draftContent,
  onAccept,
  onEdit,
  onDiscard,
  onRegenerate,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(draftContent);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(draftContent);
  };

  const handleSaveEdit = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(draftContent);
    setIsEditing(false);
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-yellow-800">
          📝 Draft Content
        </h3>
        <span className="text-sm text-yellow-600">
          Review before accepting
        </span>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Edit the draft content..."
            fullWidth
            className="h-64"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSaveEdit}
              size="md"
              variant="primary"
            >
              Save Changes
            </Button>
            <Button
              onClick={handleCancelEdit}
              size="md"
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {draftContent}
            </pre>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => onAccept(draftContent)}
              disabled={isLoading}
              size="md"
              variant="primary"
            >
              ✓ Accept
            </Button>
            <Button
              onClick={handleEdit}
              disabled={isLoading}
              size="md"
              variant="secondary"
            >
              ✏️ Edit
            </Button>
            <Button
              onClick={onRegenerate}
              disabled={isLoading}
              size="md"
              variant="secondary"
            >
              🔄 Regenerate
            </Button>
            <Button
              onClick={onDiscard}
              disabled={isLoading}
              size="md"
              variant="ghost"
            >
              ✕ Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
