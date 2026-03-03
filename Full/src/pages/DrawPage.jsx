import { useEffect, useRef, useState } from "react";
import PageShell from "../components/PageShell";

export default function DrawPage({ navigate }) {
  const canvasRef = useRef(null);
  const [name, setName] = useState("");
  const [brushSize, setBrushSize] = useState(4);
  const [color, setColor] = useState("#111111");
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
    return { x, y };
  }

  function startDraw(e) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
    setDrawing(true);
  }

  function onDraw(e) {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDraw() {
    setDrawing(false);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
          onMouseDown={startDraw}
          onMouseMove={onDraw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={onDraw}
          onTouchEnd={stopDraw}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: 10 }}>
        <button id="createbutton" onClick={createProgimon}>Create Monster</button>
      </div>
    </PageShell>
  );
}
