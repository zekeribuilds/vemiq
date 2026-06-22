import React, { useState } from 'react';
import { DocumentsIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { EmptyState } from '@/design-system/components/EmptyState';

interface LogbookEntry {
  id: string;
  entry_date: string;
  week_number?: number;
  title?: string;
  activity_description: string;
  source_type: 'text' | 'voice' | 'image' | 'mixed';
}

interface LogbookIntegrationProps {
  availableEntries: LogbookEntry[];
  selectedEntryIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  disabled?: boolean;
}

export const LogbookIntegration: React.FC<LogbookIntegrationProps> = ({
  availableEntries,
  selectedEntryIds,
  onSelectionChange,
  disabled = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'week' | 'date'>('all');
  const [weekFilter, setWeekFilter] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

  const filteredEntries = availableEntries.filter((entry) => {
    if (filter === 'week' && weekFilter !== null) {
      return entry.week_number === weekFilter;
    }
    if (filter === 'date' && dateRange.start && dateRange.end) {
      const entryDate = new Date(entry.entry_date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return entryDate >= startDate && entryDate <= endDate;
    }
    return true;
  });

  const toggleEntry = (entryId: string) => {
    if (selectedEntryIds.includes(entryId)) {
      onSelectionChange(selectedEntryIds.filter((id) => id !== entryId));
    } else {
      onSelectionChange([...selectedEntryIds, entryId]);
    }
  };

  const selectAll = () => {
    onSelectionChange(filteredEntries.map((e) => e.id));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const uniqueWeeks = Array.from(
    new Set(availableEntries.map((e) => e.week_number).filter(Boolean))
  ).sort((a, b) => (a || 0) - (b || 0));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          📋 Logbook Entries
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={selectAll}
            disabled={disabled}
            size="sm"
            variant="secondary"
          >
            Select All
          </Button>
          <Button
            onClick={clearAll}
            disabled={disabled}
            size="sm"
            variant="ghost"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'week' | 'date')}
          disabled={disabled}
          className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
        >
          <option value="all">All Entries</option>
          <option value="week">By Week</option>
          <option value="date">By Date Range</option>
        </select>

        {filter === 'week' && (
          <select
            value={weekFilter || ''}
            onChange={(e) => setWeekFilter(e.target.value ? Number(e.target.value) : null)}
            disabled={disabled}
            className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            <option value="">All Weeks</option>
            {uniqueWeeks.map((week) => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
        )}

        {filter === 'date' && (
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              disabled={disabled}
              className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              disabled={disabled}
              className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
            />
          </div>
        )}
      </div>

      {/* Entry List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <EmptyState
            icon={<DocumentsIcon size={24} />}
            title="No entries match the current filter"
            description="Try selecting a different date range or filter"
          />
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className={`
                flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                ${selectedEntryIds.includes(entry.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !disabled && toggleEntry(entry.id)}
            >
              <input
                type="checkbox"
                checked={selectedEntryIds.includes(entry.id)}
                onChange={() => toggleEntry(entry.id)}
                disabled={disabled}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    {entry.entry_date}
                  </span>
                  {entry.week_number && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      W{entry.week_number}
                    </span>
                  )}
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                    {entry.source_type}
                  </span>
                </div>
                {entry.title && (
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {entry.title}
                  </p>
                )}
                <p className="text-xs text-gray-600 line-clamp-2">
                  {entry.activity_description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selection Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          {selectedEntryIds.length} of {availableEntries.length} entries selected
        </p>
      </div>
    </div>
  );
};
