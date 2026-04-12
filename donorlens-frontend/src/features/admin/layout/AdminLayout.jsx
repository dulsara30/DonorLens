// export default function AdminLayout({ children }) {
//   return (
//     <div className="admin-layout">
//         <nav className="admin-nav">
//             <a href="/admin/dashboard" className="admin-nav-link">Dashboard</a>
//             <a href="/admin/create-campaign" className="admin-nav-link">Create Campaign</a>
//             <a href="/admin/expense-tracker" className="admin-nav-link">Expense Tracker</a>
//             <a href="/admin/final-report" className="admin-nav-link">Final Report</a>
//         </nav>
//         <main className="admin-content">
//             {children}
//         </main>
//     </div>
//   );
// }   

import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminSidebar />

      <div className="flex-1">
        <header className="flex h-[74px] items-center border-b border-slate-200 bg-white px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-teal-800">
            {title}
          </h1>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}