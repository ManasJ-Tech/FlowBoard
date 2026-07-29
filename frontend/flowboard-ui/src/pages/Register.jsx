import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/services/authService";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("TEAM");
  const [managerCode, setManagerCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (role === "TEAM" && !managerCode.trim()) {
      setError("A manager code is required for team signup.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register({
        fullName,
        email,
        password,
        role,
        managerCode: role === "TEAM" ? managerCode.trim() : undefined,
      });

      localStorage.setItem("token", response.token);
      if (response.managerCode) {
        localStorage.setItem("managerCode", response.managerCode);
        alert(`Manager registered successfully. Your manager code is: ${response.managerCode}`);
      }
      navigate("/dashboard");
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      if (backendMessage) {
        setError(backendMessage);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An error occurred while creating your account.");
      }
      console.error("Registration error:", err.response?.data || err.message || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center py-5 bg-surface">
      <div className="col-12 col-md-6 col-xl-4">
        <div className="app-card app-card-shadow p-4">
          <div className="mb-4 text-center">
            <div className="text-primary fs-1 mb-2">Create account</div>
            <p className="app-subtitle">Start tracking your projects in seconds.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="TEAM">Team Member</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
              </select>
            </div>

            {role === "TEAM" && (
              <div className="mb-3">
                <label className="form-label">Manager Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your manager code"
                  value={managerCode}
                  onChange={(e) => setManagerCode(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>

            <div className="text-center mt-3">
              Already have an account?{' '}
              <Link to="/login" className="link-primary">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
