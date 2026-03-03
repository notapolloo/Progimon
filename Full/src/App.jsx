import { useEffect, useMemo, useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import GameHomePage from "./pages/GameHomePage";
import ProgiRoomPage from "./pages/ProgiRoomPage";
import ProgiFoodPage from "./pages/ProgiFoodPage";
import InventoryPage from "./pages/InventoryPage";
import LookupPage from "./pages/LookupPage";
import DrawPage from "./pages/DrawPage";
import AccountPage from "./pages/AccountPage";

const protectedRoutes = new Set([
  "/gameHome",
  "/progiRoom",
  "/progiFood",
  "/inventory",
  "/lookup",
  "/draw",
  "/dum",
  "/reactTest",
  "/accpage"
]);

function normalizePath(pathname) {
  if (pathname === "/index.html") return "/";
  if (pathname === "/register.html") return "/register";
  if (pathname === "/dum.html") return "/dum";
  return pathname;
}

export default function App() {
  const [path, setPath] = useState(normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const currentPath = normalizePath(window.location.pathname);
    if (currentPath !== path) {
      window.history.replaceState({}, "", path);
    }
  }, [path]);

  useEffect(() => {
    if (!protectedRoutes.has(path)) return;

    let cancelled = false;
    fetch("/api/me", { credentials: "include" })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          setPath("/");
          return;
        }
        const data = await res.json();
        if (!data.loggedIn && !cancelled) {
          setPath("/");
        }
      })
      .catch(() => {
        if (!cancelled) setPath("/");
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  const navigate = useMemo(
    () => (to) => {
      const next = normalizePath(to);
      window.history.pushState({}, "", next);
      setPath(next);
    },
    []
  );

  const pageProps = { navigate };

  const routes = {
    "/": <LoginPage {...pageProps} />,
    "/register": <RegisterPage {...pageProps} />,
    "/dum": <HomePage {...pageProps} />,
    "/gameHome": <GameHomePage {...pageProps} />,
    "/progiRoom": <ProgiRoomPage {...pageProps} />,
    "/progiFood": <ProgiFoodPage {...pageProps} />,
    "/inventory": <InventoryPage {...pageProps} />,
    "/lookup": <LookupPage {...pageProps} />,
    "/draw": <DrawPage {...pageProps} />,
    "/accpage": <AccountPage {...pageProps} />,
    "/reactTest": <HomePage {...pageProps} />
  };

  return routes[path] ?? <LoginPage {...pageProps} />;
}
