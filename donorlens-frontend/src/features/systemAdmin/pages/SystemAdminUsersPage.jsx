// ============================================
// SYSTEM ADMIN USERS PAGE
// ============================================
// Manage all registered users with advanced filtering

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SystemAdminLayout from "../layout/SystemAdminLayout";
import {
  fetchAllUsers,
  setSelectedUser,
  clearSelectedUser,
  setSearchQuery,
  setRoleFilter,
  selectFilteredUsers,
  selectUsersCountByRole,
  selectSelectedUser,
  selectUsersLoading,
} from "../../../store/slices/usersSlice";
import UserDetailsModal from "../components/UserDetailsModal";

/**
 * SystemAdminUsersPage Component
 * Features:
 * - User list with search and filters
 * - View user details and donation history
 * - Activate/deactivate accounts
 * - Send custom emails
 */
export default function SystemAdminUsersPage() {
  const dispatch = useDispatch();

  // Get data from Redux store
  const users = useSelector(selectFilteredUsers);
  const userCounts = useSelector(selectUsersCountByRole);
  const selectedUser = useSelector(selectSelectedUser);
  const loading = useSelector(selectUsersLoading);

  // Local state for search input
  const [searchInput, setSearchInput] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("ALL");

  /**
   * Fetch users on component mount
   */
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  /**
   * Handle search input change (debounced)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(searchInput));
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  /**
   * Handle role filter change
   */
  const handleRoleFilterChange = (role) => {
    setActiveRoleFilter(role);
    dispatch(setRoleFilter(role));
  };

  /**
   * Open user details modal
   */
  const handleViewUser = (user) => {
    dispatch(setSelectedUser(user));
  };

  /**
   * Close user details modal
   */
  const handleCloseModal = () => {
    dispatch(clearSelectedUser());
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SystemAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Users Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage all registered users and their accounts
            </p>
          </div>

          {/* Export Users Button (Optional) */}
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            label="Total Users"
            value={userCounts.total}
            color="blue"
            loading={loading}
          />
          <StatCard
            label="Donors"
            value={userCounts.donors}
            color="green"
            loading={loading}
          />
          <StatCard
            label="NGO Admins"
            value={userCounts.ngoAdmins}
            color="purple"
            loading={loading}
          />
          <StatCard
            label="Active"
            value={userCounts.active}
            color="emerald"
            loading={loading}
          />
          <StatCard
            label="Inactive"
            value={userCounts.inactive}
            color="red"
            loading={loading}
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex gap-2">
              {["ALL", "USER", "NGO_ADMIN"].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleFilterChange(role)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    activeRoleFilter === role
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {role === "ALL"
                    ? "All Users"
                    : role === "USER"
                      ? "Donors"
                      : "NGO Admins"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600 mt-4">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="w-16 h-16 text-slate-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="text-slate-600 font-medium">No users found</p>
              <p className="text-slate-500 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {user.fullName}
                            </p>
                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "USER"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "NGO_ADMIN"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.role === "USER"
                            ? "Donor"
                            : user.role === "NGO_ADMIN"
                              ? "NGO Admin"
                              : "Admin"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isActive ? "bg-green-500" : "bg-slate-500"
                            }`}
                          ></span>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(user.lastLoginAt)}
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </SystemAdminLayout>
  );
}

/**
 * StatCard Component
 */
function StatCard({ label, value, color, loading }) {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
    emerald: "border-emerald-200 bg-emerald-50",
    red: "border-red-200 bg-red-50",
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${colorClasses[color]}`}>
      <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
      {loading ? (
        <div className="h-8 bg-slate-200 rounded animate-pulse w-16"></div>
      ) : (
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      )}
    </div>
  );
}
