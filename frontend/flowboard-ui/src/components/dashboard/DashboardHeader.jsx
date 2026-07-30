import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "@/assets/dashboard-lottie.json";
import { getCurrentUser } from "@/services/userService";

function DashboardHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    }

    loadUser();
  }, []);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="flex items-center justify-between border-b border-surface-strong bg-surface px-8 py-5">
      <div className="flex items-center gap-4">
        <div className="h-28 w-28 md:h-32 md:w-32 rounded-3xl bg-surface-soft p-2 shadow-sm shadow-slate-200/60">
          {/* some bundlers return the component as a default export object; handle both shapes */}
          {(() => {
            const LottieComp = Lottie && Lottie.default ? Lottie.default : Lottie;
            return <LottieComp animationData={animationData} loop autoplay className="h-full w-full" />;
          })()}
        </div>
        <div>
          <p className="text-sm text-muted-custom">Welcome back,</p>
          <h2 className="text-2xl font-bold text-slate-900">Your dashboard</h2>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        <button className="rounded-lg bg-surface p-2 hover:bg-surface-soft transition">
          <Bell className="text-muted-custom" size={20} />
        </button>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
            {initials}
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-900">
              {user?.fullName ?? "Your Name"}
            </p>

            <p className="text-xs text-muted-custom">
              {user?.role ? user.role.replace("_", " ") : "Team Member"}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default DashboardHeader;