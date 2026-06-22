import React from 'react';
import { ReportPage } from './ReportPage';

interface ReportCoverPageProps {
  institutionLogo?: string;
  institutionName: string;
  faculty: string;
  department: string;
  reportType: 'SWEP' | 'SIWES';
  studentName: string;
  matricNumber: string;
  organizationName: string;
  coordinatorName: string;
  supervisorName: string;
  date: string;
}

export const ReportCoverPage: React.FC<ReportCoverPageProps> = ({
  institutionLogo,
  institutionName,
  faculty,
  department,
  reportType,
  studentName,
  matricNumber,
  organizationName,
  coordinatorName,
  supervisorName,
  date,
}) => {
  return (
    <ReportPage>
      <div className="flex flex-col items-center justify-center h-full text-center">
        {/* Institution Logo */}
        {institutionLogo && (
          <img
            src={institutionLogo}
            alt={`${institutionName} Logo`}
            className="w-32 h-32 object-contain mb-8"
          />
        )}

        {/* Institution Name */}
        <h1 className="text-2xl font-bold mb-2">{institutionName}</h1>

        {/* Faculty */}
        <p className="text-lg mb-1">{faculty}</p>

        {/* Department */}
        <p className="text-lg mb-8">{department}</p>

        {/* Report Title */}
        <div className="mt-12 mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {reportType === 'SWEP' ? 'STUDENT WORK EXPERIENCE PROGRAM' : 'STUDENTS INDUSTRIAL WORK EXPERIENCE SCHEME'}
          </h2>
          <p className="text-xl">REPORT</p>
        </div>

        {/* Student Information */}
        <div className="mt-16 space-y-2 text-left">
          <p>
            <span className="font-semibold">Student Name:</span> {studentName}
          </p>
          <p>
            <span className="font-semibold">Matric Number:</span> {matricNumber}
          </p>
          <p>
            <span className="font-semibold">Organization:</span> {organizationName}
          </p>
          <p>
            <span className="font-semibold">SIWES Coordinator:</span> {coordinatorName}
          </p>
          <p>
            <span className="font-semibold">Supervisor:</span> {supervisorName}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {date}
          </p>
        </div>
      </div>
    </ReportPage>
  );
};
