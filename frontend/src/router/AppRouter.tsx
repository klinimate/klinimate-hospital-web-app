import { Navigate, Route, Routes } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { NewPatientPage } from '@/pages/NewPatientPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PatientIntelligencePage } from '@/pages/PatientIntelligencePage'
import { PatientsPage } from '@/pages/PatientsPage'
import { KlinimatePage } from '@/pages/KlinimatePage'
import { OrganizationPage } from '@/pages/OrganizationPage'
import { MedicalNotesPage } from '@/pages/MedicalNotesPage'
import { InvestigationsPage } from '@/pages/InvestigationsPage'
import { MedicationsPage } from '@/pages/MedicationsPage'
import { VitalsPage } from '@/pages/VitalsPage'
import { TimelinePage } from '@/pages/TimelinePage'

function PatientRouteRedirect() {
  const { patientId } = useParams()

  return <Navigate to={patientId ? `/patients/${patientId}/dashboard` : '/patients'} replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<Navigate to="/patients" replace />} />
      <Route path="/cases" element={<Navigate to="/klinimate" replace />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="/patients/new" element={<NewPatientPage />} />
      <Route path="/patients/:patientId/dashboard" element={<PatientIntelligencePage />} />
      <Route path="/patients/:patientId" element={<PatientRouteRedirect />} />
      <Route path="/patients/:patientId/intelligence" element={<PatientRouteRedirect />} />
      <Route path="/patients/:patientId/notes" element={<MedicalNotesPage />} />
      <Route path="/patients/:patientId/investigations" element={<InvestigationsPage />} />
      <Route path="/patients/:patientId/medications" element={<MedicationsPage />} />
      <Route path="/patients/:patientId/vitals" element={<VitalsPage />} />
      <Route path="/patients/:patientId/timeline" element={<TimelinePage />} />
      <Route path="/klinimate" element={<KlinimatePage />} />
      <Route path="/notifications" element={<Navigate to="/klinimate" replace />} />
      <Route path="/organization" element={<OrganizationPage />} />
      <Route path="/profile" element={<Navigate to="/organization" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
