import { useEffect, useRef, useState } from "react";
import PageShell from "../components/PageShell";

const TOOL_OPTIONS = [
  { id: "brush", label: "Brush" },
  { id: "pencil", label: "Pencil" },
  { id: "eraser", label: "Eraser" },
  { id: "rectangle", label: "Rectangle" },
  { id: "circle", label: "Circle" },
  { id: "triangle", label: "Triangle" },
  { id: "square", label: "Square" },
  { id: "pentagon", label: "Pentagon" },
  { id: "hexagon", label: "Hexagon" },
  { id: "line", label: "Line" },
  { id: "arrow", label: "Arrow" }
];

const COLOR_SWATCHES = ["#000000", "#ef4415", "#17a34a", "#1f6fff", "#ff00aa", "#ffffff"];

export default function DrawPage({ navigate }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);
  const historyRef = useRef([]);

  const [name, setName] = useState("");
  const [tool, setTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(4);
  const [color, setColor] = useState("#111111");
  const [fillShape, setFillShape] = useState(false);

  function getCtx() {
    return canvasRef.current?.getContext("2d");
  }

  function pushHistory() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const shot = canvas.toDataURL("image/png");
    historyRef.current.push(shot);
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
  }

  function restoreFromDataURL(dataUrl) {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx || !dataUrl) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pushHistory();
  }, []);

  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  }

  function setupContext() {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.lineWidth = brushSize;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = tool === "pencil" ? "butt" : "round";
    ctx.lineJoin = "round";
  }

  function drawPolygon(ctx, x, y, radius, sides) {
    if (sides < 3) return;
    ctx.beginPath();
    for (let i = 0; i < sides; i += 1) {
      const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    fillShape ? ctx.fill() : ctx.stroke();
  }

  function drawArrow(ctx, x1, y1, x2, y2) {
    const headLength = Math.max(10, brushSize * 3);
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    fillShape ? ctx.fill() : ctx.stroke();
  }

  function drawShapePreview(ctx, x, y) {
    const { x: startX, y: startY } = startPointRef.current;
    const width = x - startX;
    const height = y - startY;
    const radius = Math.sqrt(width * width + height * height);

    switch (tool) {
      case "rectangle":
        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        fillShape ? ctx.fill() : ctx.stroke();
        break;
      case "square": {
        const side = Math.max(Math.abs(width), Math.abs(height));
        const sx = width < 0 ? startX - side : startX;
        const sy = height < 0 ? startY - side : startY;
        ctx.beginPath();
        ctx.rect(sx, sy, side, side);
        fillShape ? ctx.fill() : ctx.stroke();
        break;
      }
      case "circle":
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        fillShape ? ctx.fill() : ctx.stroke();
        break;
      case "triangle":
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.lineTo(startX * 2 - x, y);
        ctx.closePath();
        fillShape ? ctx.fill() : ctx.stroke();
        break;
      case "pentagon":
        drawPolygon(ctx, startX, startY, radius, 5);
        break;
      case "hexagon":
        drawPolygon(ctx, startX, startY, radius, 6);
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case "arrow":
        drawArrow(ctx, startX, startY, x, y);
        break;
      default:
        break;
    }
  }

  function startDraw(e) {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e);

    setupContext();
    isDrawingRef.current = true;
    startPointRef.current = { x, y };
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function onDraw(e) {
    e.preventDefault();
    if (!isDrawingRef.current) return;

    const ctx = getCtx();
    const { x, y } = getPos(e);
    setupContext();

    if (tool === "brush" || tool === "pencil" || tool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
      return;
    }

    ctx.putImageData(snapshotRef.current, 0, 0);
    drawShapePreview(ctx, x, y);
  }

  function stopDraw(e) {
    if (e) e.preventDefault();
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    pushHistory();
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pushHistory();
  }

  function undoLast() {
    if (historyRef.current.length <= 1) return;
    historyRef.current.pop();
    const previous = historyRef.current[historyRef.current.length - 1];
    restoreFromDataURL(previous);
  }

  function saveImage() {
    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png");
    link.download = `progimon-${Date.now()}.png`;
    link.click();
  }

  async function createProgimon(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a monster name!");
      return;
    }

    const img_url = canvasRef.current.toDataURL("image/png");
    const res = await fetch("/api/progimon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: name.trim(),
        level: 0,
        img_url
      })
    });

    if (res.ok) {
      navigate("/dum");
    } else {
      alert("Failed to create progimon");
    }
  }

  return (
    <PageShell title="Draw Your Monster Below!" useBg={false}>
      <div className="spa-draw-controls">
        <div className="spa-tool-grid">
          {TOOL_OPTIONS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tool === t.id ? "spa-tool-button active" : "spa-tool-button"}
              onClick={() => setTool(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="spa-color-row">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className="spa-color-dot"
              style={{ backgroundColor: swatch }}
              onClick={() => setColor(swatch)}
              aria-label={`Choose color ${swatch}`}
            />
          ))}
        </div>

        <label>
          Name:
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
        </label>
        <label>
          Brush:
          <input type="range" min="1" max="30" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
        </label>
        <label>
          Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          Fill Shapes:
          <input type="checkbox" checked={fillShape} onChange={(e) => setFillShape(e.target.checked)} />
        </label>
        <button type="button" onClick={undoLast}>Undo</button>
        <button type="button" onClick={clearCanvas}>Clear Canvas</button>
        <button type="button" onClick={saveImage}>Save Image</button>
        <button type="button" onClick={() => navigate("/dum")}>Back Home</button>
      </div>

      <div className="spa-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          className="spa-draw-canvas"
          onPointerDown={startDraw}
          onPointerMove={onDraw}
          onPointerUp={stopDraw}
          onPointerLeave={stopDraw}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: 10 }}>
        <button id="createbutton" type="button" onClick={createProgimon}>Create Monster</button>
      </div>
    </PageShell>
  );
}
