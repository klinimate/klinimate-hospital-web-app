import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/Card'

const notifications = [
  {
    id: '1',
    title: 'Expert advice received',
    message: 'Cardiology review completed for CASE-1031.',
    time: '10 min ago',
    unread: true,
  },
  {
    id: '2',
    title: 'Case escalated',
    message: 'CASE-1038 has been flagged for urgent review.',
    time: '45 min ago',
    unread: true,
  },
  {
    id: '3',
    title: 'AI assessment ready',
    message: 'New assessment generated for CASE-1042.',
    time: '2 hrs ago',
    unread: false,
  },
] as const

export function NotificationsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-5">
        <header>
          <h1 className="text-xl font-semibold text-text">Notifications</h1>
          <p className="mt-1 text-sm text-text-muted">
            Stay updated on case activity
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <div className="flex gap-3">
                {notification.unread ? (
                  <span
                    aria-hidden="true"
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-500"
                  />
                ) : (
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text">{notification.title}</p>
                  <p className="mt-1 text-sm text-text-muted">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-text-muted">
                    {notification.time}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
