import { useEffect, useMemo, useState } from "react";
import LoginPage from "./pages/index";
import RegisterPage from "./pages/register";
import HomePage from "./pages/dum";
import GameHomePage from "./pages/gameHome";
import ProgiRoomPage from "./pages/ProgiRoom";
import ProgiFoodPage from "./pages/ProgiFood";
import InventoryPage from "./pages/Inventory";
import LookupPage from "./pages/LookUp";
import DrawPage from "./pages/draw";
import AccountPage from "./pages/accpage";
import Game1Page from "./pages/Game1";
import Game2Page from "./pages/Game2";
import Game3Page from "./pages/Game3";
import Game4Page from "./pages/Game4";


const protectedRoutes = new Set([
  "/gameHome",
  "/progiRoom",
  "/progiFood",
  "/inventory",
  "/lookup",
  "/draw",
  "/dum",
  "/reactTest",
  "/accpage",
  "/Game1",
  "/Game2",
  "/Game3",
  "/Game4"
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
    "/Game1": <Game1Page {...pageProps} />,
    "/Game2": <Game2Page {...pageProps} />,
    "/Game3": <Game3Page {...pageProps} />,
    "/Game4": <Game4Page {...pageProps} />,
  };

  return routes[path] ?? <LoginPage {...pageProps} />;
}
