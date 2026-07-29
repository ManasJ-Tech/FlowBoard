import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/userService";

function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getCurrentUser();
        setUser(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="p-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h3 mb-3">Settings</h1>
          <p className="text-muted">Use this screen to manage your profile preferences, notifications, and application settings.</p>

          <div className="row g-3 mt-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h2 className="h5">Account</h2>
                  {loading ? (
                    <p className="mb-0 text-muted">Loading account...</p>
                  ) : user ? (
                    <div>
                      <p className="mb-0">{user.fullName}</p>
                      <p className="mb-0 text-muted">{user.email}</p>
                    </div>
                  ) : (
                    <p className="mb-0 text-muted">No account information.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h2 className="h5">Notifications</h2>
                  <p className="mb-0 text-muted">Configure email alerts, reminders, and workspace notifications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
