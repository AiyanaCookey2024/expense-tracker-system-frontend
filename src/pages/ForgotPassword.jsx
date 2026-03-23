import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${apiURL}/api/auth/password-reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      alert(data.message);
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    }
  }

  return (
    <div className="container">
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="btn">Send reset link</button>
      </form>
    </div>
  );
}

export default ForgotPassword;