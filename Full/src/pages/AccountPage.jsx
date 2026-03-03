import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";

export default function AccountPage() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setMe(data))
      .catch(() => setMe(null));
  }, []);

  return (
    <PageShell title="My Account Page">
      <div id="account-content">
        <div className="account-info">
          <h2>Account Information</h2>
          <p><strong>User:</strong> {me?.username || "Unknown"}</p>
          <p><strong>User ID:</strong> {me?.userId || "Unknown"}</p>
        </div>
      </div>
    </PageShell>
  );
}
