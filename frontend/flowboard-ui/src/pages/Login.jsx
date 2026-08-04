import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login, forgotPassword } from "@/services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [isSendingForgot, setIsSendingForgot] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;
    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error response:", err.response ?? err);
      const resp = err.response;
      if (resp) {
        const { status, data } = resp;

        // treat 401 and 403 as invalid credentials for friendly message
        if (status === 401 || status === 403) {
          // map any field errors too
          if (data?.errors) {
            if (Array.isArray(data.errors)) {
              data.errors.forEach((e) => {
                if (e.field === "email") setEmailError(e.message || e.msg || e);
                if (e.field === "password") setPasswordError(e.message || e.msg || e);
              });
            } else if (typeof data.errors === "object") {
              if (data.errors.email) setEmailError(data.errors.email);
              if (data.errors.password) setPasswordError(data.errors.password);
            }
          }

          setError("Invalid email or password.");
          return;
        }

        // map validation errors if present
        if (data?.errors) {
          if (Array.isArray(data.errors)) {
            data.errors.forEach((e) => {
              if (e.field === "email") setEmailError(e.message || e.msg || e);
              if (e.field === "password") setPasswordError(e.message || e.msg || e);
            });
          } else if (typeof data.errors === "object") {
            if (data.errors.email) setEmailError(data.errors.email);
            if (data.errors.password) setPasswordError(data.errors.password);
          }
        }

        const serverMessage =
          data?.message || data?.error || (typeof data === "string" ? data : null) ||
          (data && Object.keys(data).length ? JSON.stringify(data) : null) ||
          resp.statusText;

        setError(serverMessage || "An error occurred while signing in.");
      } else {
        console.error("No response from server:", err);
        // Show the actual error message when available (helps with CORS/Network/Timeout errors)
        setError(err?.message || "Network error. Check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-vh-100 d-flex align-items-center bg-surface">
      <div className="container py-5">
        <div className="row gx-0 shadow-lg rounded-4 overflow-hidden">
          <div className="col-12 col-lg-6 bg-primary text-white p-5 d-flex flex-column justify-content-between">
            <div>
              <span className="badge bg-white text-primary mb-2 fs-4 fw-semibold py-2 px-3">ConcurDev</span>
              <h1 className="display-6 fw-bold mb-3">Real-time project management workspace</h1>
              <p className="lead text-white-75 mb-4">
                Collaborate instantly, track every milestone, and keep your team moving forward together.
              </p>
              <ul className="list-unstyled lh-lg fw-semibold">
                <li className="mb-2">✓ Live task updates across the team</li>
                <li className="mb-2">✓ Centralized boards for every project</li>
                <li className="mb-2">✓ Smarter planning with instant reminders</li>
              </ul>
            </div>

            <div className="mt-4 pt-4 border-top border-white/20">
              <p className="mb-1 text-white-75">Unlock more focus and faster delivery</p>
              <p className="fs-6">
                Sign in to ConcurDev and turn your project roadmap into reality.
              </p>
            </div>
          </div>

          <div className="col-12 col-lg-6 bg-white p-4 d-flex align-items-center justify-content-center">
            <div className="w-100" style={{ maxWidth: 460 }}>
              <div className="app-card app-card-shadow p-4">
                <div className="mb-4 text-center">
                  <div className="text-primary display-3 fw-bold mb-2">ConcurDev</div>
                  <p className="app-subtitle">Sign in to the real-time project management workspace.</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${emailError ? "is-invalid" : ""}`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => {
                        if (!email) setEmailError("Email is required.");
                        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                          setEmailError("Please enter a valid email address.");
                        else setEmailError("");
                      }}
                    />
                    {emailError && (
                      <div className="invalid-feedback d-block">{emailError}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${passwordError ? "is-invalid" : ""}`}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => {
                          if (!password) setPasswordError("Password is required.");
                          else setPasswordError("");
                        }}
                      />
                      {passwordError && (
                        <div className="invalid-feedback d-block">{passwordError}</div>
                      )}
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert" aria-atomic="true">
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </button>

                  <div className="text-center mt-3">
                    Don't have an account?{' '}
                    <Link to="/register" className="link-primary">
                      Sign up
                    </Link>
                  </div>
                  <div className="text-center mt-2">
                    <button type="button" className="btn btn-link p-0" onClick={() => setShowForgot((s) => !s)}>
                      Forgot password?
                    </button>
                  </div>
                  {showForgot && (
                    <div className="mt-3 p-3 border rounded bg-light">
                      <h6>Reset password</h6>
                      {forgotSuccess && (
                        <div className="alert alert-success" role="alert" aria-atomic="true">{forgotSuccess}</div>
                      )}
                      {forgotError && (
                        <div className="alert alert-danger" role="alert" aria-atomic="true">{forgotError}</div>
                      )}
                      <div className="mb-2">
                        <input
                          type="email"
                          className={`form-control`}
                          placeholder="Enter your email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={isSendingForgot}
                          onClick={async () => {
                            setForgotError("");
                            setForgotSuccess("");
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!forgotEmail) {
                              setForgotError("Email is required.");
                              return;
                            }
                            if (!emailRegex.test(forgotEmail)) {
                              setForgotError("Please enter a valid email address.");
                              return;
                            }
                            setIsSendingForgot(true);
                            try {
                              const resp = await forgotPassword({ email: forgotEmail });
                              setForgotSuccess(resp?.message || "If an account exists, a reset link has been sent.");
                            } catch (e) {
                              console.error(e);
                              setForgotError("Unable to send reset link. Try again later.");
                            } finally {
                              setIsSendingForgot(false);
                            }
                          }}
                        >
                          {isSendingForgot ? "Sending..." : "Send reset link"}
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForgot(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
