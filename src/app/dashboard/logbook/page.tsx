'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import PageContainer from '@/components/layout/PageContainer';
import { SearchIcon, FilterIcon, CreateIcon, DocumentsIcon, MicIcon, CameraIcon, UploadIcon, ChevronRightIcon, XIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { EmptyState } from '@/design-system/components/EmptyState';

export default function DashboardLogbookPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [logbookEntries, setLogbookEntries] = useState<any[]>([]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'text', label: 'Text' },
    { id: 'voice', label: 'Voice' },
    { id: 'image', label: 'Image' },
  ];

  const fabActions = [
    { icon: DocumentsIcon, label: 'Type Entry', color: 'text-[#22C55E]', action: () => {} },
    { icon: MicIcon, label: 'Record Audio', color: 'text-[#F59E0B]', action: () => {} },
    { icon: CameraIcon, label: 'Take Picture', color: 'text-[#8B5CF6]', action: () => {} },
    { icon: UploadIcon, label: 'Upload Image', color: 'text-[#3B82F6]', action: () => {} },
  ];

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'voice':
        return <MicIcon size={20} className="text-[#F59E0B]" />;
      case 'image':
        return <CameraIcon size={20} className="text-[#8B5CF6]" />;
      default:
        return <DocumentsIcon size={20} className="text-[#22C55E]" />;
    }
  };

  const filteredEntries = logbookEntries.filter((entry) => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (entry.content && entry.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || entry.entry_type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('weekly_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching weekly logs:', error);
          setError(true);
        } else {
          setLogbookEntries(data || []);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching weekly logs:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Failed to load entries</p>
            <Button
              onClick={() => window.location.reload()}
              size="md"
              variant="primary"
            >
              Retry
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Logbook</h1>
        <p className="text-muted-foreground">Document your daily activities and experiences</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
        <Button
          onClick={() => setShowFabMenu(!showFabMenu)}
          size="md"
          variant="primary"
          leftIcon={<CreateIcon size={20} />}
        >
          Add Entry
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            size="sm"
            variant={activeFilter === filter.id ? 'primary' : 'ghost'}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-24">
          <DocumentsIcon size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {searchQuery || activeFilter !== 'all' ? 'No entries match your search' : 'No entries yet'}
          </p>
          {!searchQuery && activeFilter === 'all' && (
            <Button
              onClick={() => setShowFabMenu(!showFabMenu)}
              size="md"
              variant="primary"
            >
              Add Your First Entry
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="card p-6 flex items-start gap-4 cursor-pointer hover:border-accent transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                {getEntryIcon(entry.entry_type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {entry.title || 'Untitled Entry'}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(entry.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {entry.content?.substring(0, 150) || 'No content'}
                </p>
              </div>
              <ChevronRightIcon size={20} className="text-muted-foreground flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
