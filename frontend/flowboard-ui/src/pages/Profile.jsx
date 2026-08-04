import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/userService";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      // Redirect to login if there's no token
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error(err);
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }

        setError("Unable to load profile. Please refresh or log in again.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  if (loading) {
    return <p className="text-muted-custom">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (!user) {
    return <p className="text-muted-custom">No profile information available.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-custom mt-2">Your account details and workspace settings.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-surface-strong bg-surface-soft p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Personal Info</h2>
          <div className="mt-4 space-y-3 text-muted-custom">
            <p>
              <span className="text-slate-700">Full Name:</span> {user.fullName}
            </p>
            <p>
              <span className="text-slate-700">Email:</span> {user.email}
            </p>
            <p>
              <span className="text-slate-700">Role:</span> {user.role ?? "User"}
            </p>
            {user.managerCode && (
              <p>
                <span className="text-slate-700">Manager Code:</span> {user.managerCode}
              </p>
            )}
            {user.managerName && (
              <p>
                <span className="text-slate-700">Project Manager:</span> {user.managerName}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-surface-strong bg-surface-soft p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Account</h2>
          <div className="mt-4 space-y-3 text-muted-custom">
            <p>
              <span className="text-slate-700">User ID:</span> {user.id}
            </p>
            <p>
              <span className="text-slate-700">Joined:</span>{" "}
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
            </p>
            <p>Manage your projects, board, and profile from the sidebar.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
