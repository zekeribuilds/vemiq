import { create } from 'zustand';

interface StudentInfo {
  academicSession: string;
  companyName: string;
  organizationDepartment: string;
  supervisorName: string;
  coordinatorName: string;
  startDate: string;
  endDate: string;
}

interface ReportStructure {
  numberOfChapters: number;
  includeDedication: boolean;
  includeAcknowledgement: boolean;
  includeAbstract: boolean;
  includeTableOfContents: boolean;
}

interface ReportState {
  currentStep: number;
  reportType: 'SWEP' | 'SIWES' | null;
  studentInfo: StudentInfo;
  reportStructure: ReportStructure;
  weeklyLogs: Array<{ week: number; title: string; description: string; images?: string[] }>;
  
  setStep: (step: number) => void;
  setReportType: (type: 'SWEP' | 'SIWES') => void;
  setStudentInfo: (info: Partial<StudentInfo>) => void;
  setReportStructure: (structure: Partial<ReportStructure>) => void;
  addWeeklyLog: (log: { week: number; title: string; description: string; images?: string[] }) => void;
  updateWeeklyLog: (week: number, log: { title: string; description: string; images?: string[] }) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  reportType: null,
  studentInfo: {
    academicSession: '',
    companyName: '',
    organizationDepartment: '',
    supervisorName: '',
    coordinatorName: '',
    startDate: '',
    endDate: '',
  },
  reportStructure: {
    numberOfChapters: 5,
    includeDedication: true,
    includeAcknowledgement: true,
    includeAbstract: true,
    includeTableOfContents: true,
  },
  weeklyLogs: [],
};

export const useReportStore = create<ReportState>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ currentStep: step }),
  
  setReportType: (type) => set({ reportType: type }),
  
  setStudentInfo: (info) =>
    set((state) => ({
      studentInfo: { ...state.studentInfo, ...info },
    })),
  
  setReportStructure: (structure) =>
    set((state) => ({
      reportStructure: { ...state.reportStructure, ...structure },
    })),
  
  addWeeklyLog: (log) =>
    set((state) => ({
      weeklyLogs: [...state.weeklyLogs, log],
    })),
  
  updateWeeklyLog: (week, log) =>
    set((state) => ({
      weeklyLogs: state.weeklyLogs.map((l) =>
        l.week === week ? { ...l, ...log, images: log.images || l.images } : l
      ),
    })),
  
  reset: () => set(initialState),
}));
