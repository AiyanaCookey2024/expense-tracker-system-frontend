import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";

const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";
console.log("API URL is", apiURL)

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${apiURL}/api/auth/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Invalid username or password");
        return;
      }

      if (!data.access || !data.refresh) {
        alert("Login failed: token not returned");
        return;
      }

      login(data.access, data.refresh, username);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while logging in.");
    }
  }

  return (
    < div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn">
          Login</button>
      </form>

      <p className="auth-switch">
        Don't have an account ? <Link to="/register">Register</Link>
      </p>

      <p className="auth-switch">
        Forgot your password? <Link to="/forgot-password">Reset it</Link>
      </p>

    </div>
    );
  };

export const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(`${apiURL}/api/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    navigate("/login");
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn">
          Register</button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>

    </div>
    );
  };
