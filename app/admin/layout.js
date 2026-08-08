import AdminSidebar from './AdminSidebar';

export const metadata = { title: 'Admin — Travel Teasing' };

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#f4f6f9', fontFamily: "'DM Sans', sans-serif" }}>
      <AdminSidebar />
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
