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
import DrawPadPage from "./pages/drawPad";
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
  "/drawPad",
  "/dum",
  "/reactTest",
  "/accpage",
  "/Game1",
  "/Game2",
  "/Game3",
  "/Game4"
]);

function normalizePath(pathname) {
  if (!pathname) return "/";

  const trimmed = pathname.replace(/\/+$/, "") || "/";

  const aliases = {
    "/index.html": "/",
    "/register.html": "/register",
    "/dum.html": "/dum",

    // common typos / casing variants
    "/drawpad": "/drawPad",
    "/ProgiRoom": "/progiroom",

  };

  return aliases[trimmed] ?? aliases[trimmed.toLowerCase()] ?? trimmed;
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
      const url = new URL(to, window.location.origin);
      const nextPath = normalizePath(url.pathname);
      const nextUrl = `${nextPath}${url.search}${url.hash}`;
      window.history.pushState({}, "", nextUrl);
      setPath(nextPath);
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
    "/drawPad": <DrawPadPage {...pageProps} />,
    "/accpage": <AccountPage {...pageProps} />,
    "/Game1": <Game1Page {...pageProps} />,
    "/Game2": <Game2Page {...pageProps} />,
    "/Game3": <Game3Page {...pageProps} />,
    "/Game4": <Game4Page {...pageProps} />,
  };

  return routes[path] ?? <LoginPage {...pageProps} />;
}
