import { useState } from "react";
import PageShell from "../components/PageShell";

export default function LoginPage({ navigate }) {
  const [User, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ User, password })
      });
      const data = await res.json();
      if (data.success) {
        navigate("/dum");
      } else {
        setError("Login failed");
      }
    } catch {
      setError("Could not connect to server");
    }
  }

  return (
    <PageShell title="Welcome to Progimon">
      <form id="login-form" onSubmit={onSubmit}>
        <label htmlFor="username">Username:</label>
        <input id="username" required value={User} onChange={(e) => setUser(e.target.value)} />
        <br />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <input type="submit" value="Login" />
      </form>

      <div id="register-link">
        <p>
          Don&apos;t have an account?{" "}
          <button className="spa-link-button" onClick={() => navigate("/register")}>
            Register here
          </button>
        </p>
      </div>

      <img id="logo" src="/imgs/progimonTitle.png" alt="Progimon Steve" title="Steve the first progimon" />
      {error ? <p className="spa-form-message">{error}</p> : null}
    </PageShell>
  );
}
