'use client';

import { useState, useEffect } from 'react';
import { RichTextEditor } from '@/components/editor';
import { DocumentsIcon, MessageSquareIcon, CalendarIcon, BookOpenIcon, EyeIcon, DownloadIcon, SettingsIcon, DashboardIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import Link from 'next/link';
import ReportPreview from '@/components/preview/ReportPreview';
import ChatPanel from '@/components/ai/ChatPanel';
import { createClient } from '@/lib/supabase/browser';

export default function ReportEditorPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'editor' | 'chat' | 'logs' | 'preview'>('overview');
  const [sectionContent, setSectionContent] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [weeklyLogs, setWeeklyLogs] = useState<any[]>([]);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: DashboardIcon },
    { id: 'editor' as const, label: 'Editor', icon: DocumentsIcon },
    { id: 'chat' as const, label: 'AI Chat', icon: MessageSquareIcon },
    { id: 'logs' as const, label: 'Weekly Logs', icon: CalendarIcon },
    { id: 'preview' as const, label: 'Preview', icon: EyeIcon },
  ];

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const supabase = createClient();
        const { data: report, error } = await supabase
          .from('reports')
          .select(`
            *,
            report_metadata(*),
            institution:institutions(name),
            faculty:faculties(name),
            department:departments(name),
            organization:organizations(name)
          `)
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setReportData(report);

        // Fetch report sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('report_sections')
          .select('*')
          .eq('report_id', params.id)
          .order('sort_order', { ascending: true });

        if (sectionsError) throw sectionsError;
        setSections(sectionsData || []);

        if (sectionsData && sectionsData.length > 0) {
          setSelectedSection(sectionsData[0]);
          setSectionContent(sectionsData[0].content || '');
        }

        // Fetch weekly logs
        const { data: logsData, error: logsError } = await supabase
          .from('weekly_logs')
          .select('*')
          .eq('report_id', params.id)
          .order('week_number', { ascending: true });

        if (logsError) throw logsError;
        setWeeklyLogs(logsData || []);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [params.id]);

  const handleSectionChange = async (content: string) => {
    setSectionContent(content);
    setSaveStatus('unsaved');
  };

  const handleSaveSection = async () => {
    if (!selectedSection) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('report_sections')
        .update({ 
          content: sectionContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedSection.id);

      if (error) throw error;
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving section:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Autosave every 5 seconds if unsaved
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (saveStatus === 'unsaved' && !isSaving) {
      interval = setTimeout(() => {
        handleSaveSection();
      }, 5000);
    }
    return () => clearTimeout(interval);
  }, [saveStatus, isSaving]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link
            href="/dashboard/reports"
            className="text-sm text-gray-600 hover:text-accent"
          >
            ← Back to Reports
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <Button
                    onClick={() => setActiveTab(tab.id)}
                    variant={activeTab === tab.id ? 'primary' : 'ghost'}
                    size="md"
                    fullWidth
                    leftIcon={<Icon size={20} />}
                    className="justify-start"
                  >
                    {tab.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button
            fullWidth
            size="md"
            variant="ghost"
            leftIcon={<DownloadIcon size={20} />}
            className="justify-start"
          >
            Export PDF
          </Button>
          <Button
            fullWidth
            size="md"
            variant="ghost"
            leftIcon={<SettingsIcon size={20} />}
            className="justify-start"
          >
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="flex-1 overflow-auto p-8 bg-gray-50">
                <div className="max-w-4xl mx-auto space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Report Overview</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Report Title</label>
                          <p className="text-foreground font-semibold">{reportData?.title || 'Untitled'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Report Type</label>
                          <p className="text-foreground font-semibold">{reportData?.report_type || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Status</label>
                          <p className="text-foreground font-semibold capitalize">{reportData?.status || 'Draft'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Progress</label>
                          <p className="text-foreground font-semibold">{reportData?.progress_percentage || 0}%</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {reportData?.report_metadata && (
                    <Card className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">Student Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Student Name</label>
                          <p className="text-foreground">{reportData.report_metadata.student_name || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Matric Number</label>
                          <p className="text-foreground">{reportData.report_metadata.matric_number || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Academic Level</label>
                          <p className="text-foreground">{reportData.report_metadata.academic_level || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Academic Session</label>
                          <p className="text-foreground">{reportData.report_metadata.academic_session || 'N/A'}</p>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Organization Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Institution</label>
                        <p className="text-foreground">{reportData?.institution?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Faculty</label>
                        <p className="text-foreground">{reportData?.faculty?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Department</label>
                        <p className="text-foreground">{reportData?.department?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Training Organization</label>
                        <p className="text-foreground">{reportData?.organization?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Report Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div 
                        className="bg-primary h-4 rounded-full transition-all duration-300"
                        style={{ width: `${reportData?.progress_percentage || 0}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      {reportData?.progress_percentage || 0}% Complete
                    </p>
                  </Card>
                </div>
              </div>
            )}
            {activeTab === 'preview' && <ReportPreview />}
            {activeTab === 'editor' && (
              <div className="flex-1 flex">
                {/* Sections Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 overflow-auto">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-foreground">Sections</h3>
                  </div>
                  <ul className="p-2 space-y-1">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <button
                          onClick={() => {
                            setSelectedSection(section);
                            setSectionContent(section.content || '');
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            selectedSection?.id === section.id
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {section.title || 'Untitled Section'}
                        </button>
                      </li>
                    ))}
                    {sections.length === 0 && (
                      <li className="px-4 py-8 text-center text-gray-500 text-sm">
                        No sections yet. Generate report structure first.
                      </li>
                    )}
                  </ul>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col bg-gray-50">
                  {selectedSection ? (
                    <>
                      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">
                          {selectedSection.title || 'Untitled Section'}
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${saveStatus === 'saved' ? 'text-green-600' : saveStatus === 'saving' ? 'text-yellow-600' : 'text-gray-500'}`}>
                            {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}
                          </span>
                          <Button
                            onClick={handleSaveSection}
                            isLoading={isSaving}
                            size="sm"
                            variant="secondary"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 p-6 overflow-auto">
                        <RichTextEditor
                          content={sectionContent}
                          onChange={handleSectionChange}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-gray-500">Select a section to edit</p>
                    </div>
                  )}
                </div>

                {/* AI Chat Panel */}
                <ChatPanel
                  sectionId={selectedSection?.id || params.id}
                  sectionContent={sectionContent}
                  onContentChange={setSectionContent}
                />
              </div>
            )}
            {activeTab === 'chat' && (
              <div className="flex-1 flex">
                <div className="flex-1 flex flex-col bg-gray-50 p-8 overflow-auto">
                  <h2 className="text-2xl font-bold text-foreground mb-6">AI Assistant</h2>
                  
                  <div className="space-y-4 mb-8">
                    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-foreground mb-2">Regenerate Section</h3>
                      <p className="text-sm text-muted-foreground">Use AI to regenerate the current section content</p>
                    </Card>
                    
                    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-foreground mb-2">Improve Writing</h3>
                      <p className="text-sm text-muted-foreground">Enhance clarity, grammar, and flow of the current section</p>
                    </Card>
                    
                    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-foreground mb-2">Summarize Section</h3>
                      <p className="text-sm text-muted-foreground">Generate a concise summary of the current section</p>
                    </Card>
                    
                    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-foreground mb-2">Expand Content</h3>
                      <p className="text-sm text-muted-foreground">Add more detail and depth to the current section</p>
                    </Card>
                  </div>

                  <div className="mt-auto">
                    <ChatPanel
                      sectionId={selectedSection?.id || params.id}
                      sectionContent={sectionContent}
                      onContentChange={setSectionContent}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'logs' && (
              <div className="flex-1 overflow-auto p-8 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Weekly Logs</h2>
                  {weeklyLogs.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-gray-500">No weekly logs linked to this report yet.</p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {weeklyLogs.map((log) => (
                        <Card key={log.id} className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">
                              Week {log.week_number}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              log.status === 'completed' ? 'bg-green-100 text-green-700' :
                              log.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                          {log.title && (
                            <p className="text-foreground font-medium mb-2">{log.title}</p>
                          )}
                          {log.description && (
                            <p className="text-gray-600 mb-4">{log.description}</p>
                          )}
                          {log.summary && (
                            <div className="p-4 bg-primary/5 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">AI Summary</p>
                              <p className="text-sm text-foreground">{log.summary}</p>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
