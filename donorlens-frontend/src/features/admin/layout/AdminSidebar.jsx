import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, FolderKanban, Heart, Zap } from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
  },
  {
    label: "Create Campaign",
    path: "/admin/campaigns/new",
    icon: PlusCircle,
    key: "createCampaign",
  },
  {
    label: "My Campaigns",
    path: "/admin/campaigns",
    icon: FolderKanban,
    key: "myCampaigns",
  },
  {
    label: "Campaign Executions",
    path: "/admin/campaign-executions",
    icon: Zap,
    key: "campaignExecutions",
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const isItemActive = (key) => {
    if (key === "dashboard") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }

    if (key === "createCampaign") {
      return pathname === "/admin/campaigns/new";
    }

    if (key === "myCampaigns") {
      return (
        pathname.startsWith("/admin/campaigns") &&
        pathname !== "/admin/campaigns/new"
      );
    }

    if (key === "campaignExecutions") {
      return pathname.startsWith("/admin/campaign-executions");
    }

    return false;
  };

  return (
    <aside className="flex min-h-screen w-[260px] flex-col justify-between border-r border-slate-200 bg-white">
      <div>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-600 text-white">
            <Heart size={18} />
          </div>

          <div className="text-[1.4rem] font-semibold text-slate-800">
            Donor<span className="text-teal-600">Lens</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2 px-3 py-6">
          {navItems.map((item) => {
            const isActive = isItemActive(item.key);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] transition ${
                  isActive
                    ? "bg-teal-50 font-medium text-teal-700"
                    : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 px-5 py-4">
        <NavLink
          to="/"
          className="text-sm text-slate-400 transition hover:text-slate-600"
        >
          ← Back to Home
        </NavLink>
      </div>
    </aside>
  );
}