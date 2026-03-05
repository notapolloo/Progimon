import { useState } from "react";
import PageShell from "../components/PageShell";

export default function RegisterPage({ navigate }) {
  const [Email, setEmail] = useState("");
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/ACCOUNTSDEV", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ User, Email, Password })
      });

      if (res.ok) {
        navigate("/draw");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data.error || "Registration failed");
    } catch {
      setError("Could not connect to server");
    }
  }

  return (
    <PageShell title="Register Page">
      <div id="makeP">
        <form onSubmit={onSubmit}>
          <label id="labels" htmlFor="email">Email:</label>
          <input id="email" required value={Email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <br />
          <label id="labels" htmlFor="user">Username:</label>
          <input id="user" required value={User} onChange={(e) => setUser(e.target.value)} />
          <br />
          <br />
          <label id="labels" htmlFor="pass">Password:</label>
          <input id="pass" type="password" required value={Password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <br />
          <input id="submitbutton" type="submit" value="Create User" />
        </form>
      </div>
      {error ? <p className="spa-form-message">{error}</p> : null}
    </PageShell>
  );
}
