import { Navigate, Route, Routes } from 'react-router-dom'
import { CasesPage } from '@/pages/CasesPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { ProfilePage } from '@/pages/ProfilePage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
