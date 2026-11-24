import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/ampa/admin-dashboard'

export const metadata: Metadata = {
  title: 'Administration & Back-Office — AMPA Boutique Dakar',
  description:
    'Espace administration AMPA Boutique Dakar : gestion du catalogue, des stocks, des commandes, des retouches ourlet 30 min et des cartes cadeaux.',
}

export default function AdminPage() {
  return <AdminDashboard />
}
