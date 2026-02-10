export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
        <nav className="admin-nav">
            <a href="/admin/dashboard" className="admin-nav-link">Dashboard</a>
            <a href="/admin/create-campaign" className="admin-nav-link">Create Campaign</a>
            <a href="/admin/expense-tracker" className="admin-nav-link">Expense Tracker</a>
            <a href="/admin/final-report" className="admin-nav-link">Final Report</a>
        </nav>
        <main className="admin-content">
            {children}
        </main>
    </div>
  );
}   