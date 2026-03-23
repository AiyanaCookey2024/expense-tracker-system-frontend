import { useState } from "react";
import { useSearchParams , useNavigate } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${apiURL}/api/auth/password-reset-confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Password reset failed");
        return;
      }

      setSuccess(data.message || "Password reset successful");

      // Optional: clear any old auth tokens
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username")

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  }

  if (!token) {
    return (
      <div className="container">
        <h1>Invalid reset link</h1>
        <p>This password reset link is missing a token.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Set New Password</h1>

      <form onSubmit={handleSubmit}>
        <label>New Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn">Reset password </button>
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ResetPassword;