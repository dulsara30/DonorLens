export default function ExecutionDashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-teal-600"></div>
      <p className="text-sm text-slate-600">Loading campaigns...</p>
    </div>
  );
}
