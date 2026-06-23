'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { EmptyState } from '@/design-system/components/EmptyState';
import { Container, Stack } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';

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
    { iconKey: 'file', label: 'Type Entry', color: colors.success, action: () => {} },
    { iconKey: 'mic', label: 'Record Audio', color: colors.warning, action: () => {} },
    { iconKey: 'image', label: 'Take Picture', color: colors.purple, action: () => {} },
    { iconKey: 'uploads', label: 'Upload Image', color: colors.info, action: () => {} },
  ];

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'voice':
        return <div style={{ color: colors.warning }}><VemiqIcon category="content" name="voice" size={20} /></div>;
      case 'image':
        return <div style={{ color: colors.purple }}><VemiqIcon category="content" name="image" size={20} /></div>;
      default:
        return <div style={{ color: colors.success }}><VemiqIcon category="content" name="file" size={20} /></div>;
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
      <Container size="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: `4px solid ${colors.primary}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              color: colors.text.secondary,
              marginBottom: spacing.md,
            }}>
              Failed to load entries
            </p>
            <Button
              onClick={() => window.location.reload()}
              size="md"
              variant="primary"
            >
              Retry
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <div style={{ marginBottom: spacing.xl }}>
        <h1 style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '30px',
          fontWeight: '700',
          color: colors.primary,
          marginBottom: spacing.sm,
        }}>
          Logbook
        </h1>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          fontWeight: '400',
          color: colors.text.secondary,
        }}>
          Document your daily activities and experiences
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
        <div style={{ position: 'relative', width: '384px' }}>
          <div style={{ position: 'absolute', left: spacing.sm, top: '50%', transform: 'translateY(-50%)', color: colors.text.secondary }}>
            <VemiqIcon category="action" name="search" size={20} />
          </div>
          <Input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: spacing.xl }}
          />
        </div>
        <Button
          onClick={() => setShowFabMenu(!showFabMenu)}
          size="md"
          variant="primary"
          icon="create"
          iconPosition="left"
        >
          Add Entry
        </Button>
      </div>

      <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.lg }}>
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
        <EmptyState
          icon="no_logbook"
          title={searchQuery || activeFilter !== 'all' ? 'No entries match your search' : 'No entries yet'}
          description={searchQuery || activeFilter !== 'all' ? 'Try a different search term or filter' : 'Add your first logbook entry to get started'}
          actionLabel={!searchQuery && activeFilter === 'all' ? 'Add Your First Entry' : undefined}
          onAction={!searchQuery && activeFilter === 'all' ? () => setShowFabMenu(!showFabMenu) : undefined}
        />
      ) : (
        <Stack spacing="md">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              style={{
                padding: spacing.lg,
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing.md,
                cursor: 'pointer',
                backgroundColor: colors.background.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              <div style={{
                flexShrink: 0,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: colors.background.elevated,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {getEntryIcon(entry.entry_type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}>
                  {entry.title || 'Untitled Entry'}
                </h3>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: colors.text.secondary,
                  marginBottom: spacing.sm,
                }}>
                  {new Date(entry.created_at).toLocaleDateString()}
                </p>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: colors.text.secondary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {entry.content?.substring(0, 150) || 'No content'}
                </p>
              </div>
              <div style={{ color: colors.text.secondary, flexShrink: 0, marginTop: spacing.xs }}>
                <VemiqIcon category="action" name="add" size={20} />
              </div>
            </div>
          ))}
        </Stack>
      )}
    </Container>
  );
}
