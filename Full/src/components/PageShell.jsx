export default function PageShell({ title, children, useBg = true, className = "" }) {
  const containerClass = [useBg ? "spa-page" : "", className].filter(Boolean).join(" ");

  return (
    <div id={useBg ? "main-bg3" : undefined} className={containerClass}>
      {title ? <h1 id="main-heading3">{title}</h1> : null}
      {children}
    </div>
  );
}
