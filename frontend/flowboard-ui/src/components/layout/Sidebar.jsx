import { NavLink, useNavigate } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconFolders,
  IconChecklist,
  IconUsers,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: IconLayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Projects",
    icon: IconFolders,
    path: "/projects",
  },
  {
    title: "Meeting Room",
    icon: IconChecklist,
    path: "/meeting-room",
  },
  {
    title: "Profile",
    icon: IconUsers,
    path: "/profile",
  },
  {
    title: "Settings",
    icon: IconSettings,
    path: "/settings",
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="mb-5">
        <h1 className="brand-title">ConcurDev</h1>
        <p className="brand-subtitle">Project management made simple</p>
      </div>

      <nav className="flex-grow-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 rounded-3 px-3 py-2 mb-2 ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-4 pt-3 border-top" style={{ borderColor: "rgba(148, 163, 184, 0.16)" }}>
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <IconLogout size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;