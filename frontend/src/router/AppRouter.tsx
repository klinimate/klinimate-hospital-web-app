import { Navigate, Route, Routes } from 'react-router-dom'
import { CasesPage } from '@/pages/CasesPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { NewPatientPage } from '@/pages/NewPatientPage'
import { AIProcessingPage } from '@/pages/AIProcessingPage'
import { AIAssessmentPage } from '@/pages/AIAssessmentPage'
import { AdmissionWorkflowPage } from '@/pages/AdmissionWorkflowPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { PatientDetailsPage } from '@/pages/PatientDetailsPage'
import { PatientDashboard } from '@/pages/PatientDashboard'
import { PatientIntelligencePage } from '@/pages/PatientIntelligencePage'
import { PatientsPage } from '@/pages/PatientsPage'
import { ProfilePage } from '@/pages/ProfilePage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="/patients/new" element={<NewPatientPage />} />
      <Route path="/patients/ai-processing" element={<AIProcessingPage />} />
      <Route path="/patients/ai-assessment" element={<AIAssessmentPage />} />
      <Route path="/patients/:patientId/admission" element={<AdmissionWorkflowPage />} />
      <Route path="/patients/:patientId/dashboard" element={<PatientDashboard />} />
      <Route path="/patients/:patientId/intelligence" element={<PatientIntelligencePage />} />
      <Route path="/patients/:patientId" element={<PatientDetailsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
