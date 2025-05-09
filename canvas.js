import { components, canvas, ctx, grid, isGridEnabled, simulations, particles, selectedComponent } from './main.js';

function resizeCanvas() {
  const width = Math.min(window.innerWidth - 40, 800);
  canvas.width = width;
  canvas.height = width * 5 / 8;
  drawGrid();
  drawCanvas();
}

function drawCanvas() {
  const temperature = parseFloat(document.getElementById("temperature").value) || 300, tempColor = temperature < 200 ? "rgba(74, 144, 226, 0.3)" : temperature > 400 ? "rgba(255, 99, 99, 0.3)" : "rgba(125, 193, 255, 0.3)";
  ctx.fillStyle = tempColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  components.forEach(comp => {
    ctx.save();
    ctx.translate(comp.x + comp.width / 2, comp.y + comp.height / 2);
    ctx.rotate(comp.rotation * Math.PI / 180);
    ctx.scale(comp.scale, comp.scale);
    ctx.fillStyle = comp.color;
    ctx.shadowColor = comp === selectedComponent ? "#4a90e2" : "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = comp === selectedComponent ? 15 : 5;
    ctx.fillRect(-comp.width / 2, -comp.height / 2, comp.width, comp.height);
    ctx.strokeStyle = "#4a90e2";
    ctx.strokeRect(-comp.width / 2, -comp.height / 2, comp.width, comp.height);
    ctx.fillStyle = "#333";
    ctx.font = "14px Inter";
    ctx.fillText(`${comp.type}${comp.material ? ` (${comp.material})` : ""}`, -comp.width / 2 + 10, -comp.height / 2 + 20);
    ctx.restore();
  });
  particles.length = particles.filter(p => p.life > 0).length;
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(${temperature > 400 ? "255, 99, 99" : "74, 144, 226"}, ${p.life})`;
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.015;
  });
  if (components.some(c => c.type === "Source") && components.some(c => c.type === "Drain")) {
    const source = components.find(c => c.type === "Source"), drain = components.find(c => c.type === "Drain"), current = simulations.length > 0 ? simulations[simulations.length - 1].currents[50] : 1, particleRate = Math.min(0.05, current / 200);
    if (Math.random() < particleRate) particles.push({ x: source.x + source.width / 2, y: source.y + source.height / 2, vx: (drain.x - source.x) / 100, vy: (drain.y - source.y) / 100, life: 1 });
  }
  requestAnimationFrame(drawCanvas);
}

function drawGrid() {
  if (!isGridEnabled) {
    grid.innerHTML = '';
    return;
  }
  grid.innerHTML = '';
  grid.style.display = 'block';
  const step = 10;
  for (let x = 0; x <= canvas.width; x += step) {
    const line = document.createElement('div');
    line.className = 'grid-line';
    line.style.left = `${x}px`;
    line.style.top = '0';
    line.style.width = '1px';
    line.style.height = `${canvas.height}px`;
    grid.appendChild(line);
  }
  for (let y = 0; y <= canvas.height; y += step) {
    const line = document.createElement('div');
    line.className = 'grid-line';
    line.style.left = '0';
    line.style.top = `${y}px`;
    line.style.width = `${canvas.width}px`;
    line.style.height = '1px';
    grid.appendChild(line);
  }
}

function toggleGrid() {
  isGridEnabled = !isGridEnabled;
  drawGrid();
}

function getCanvasPosition(event, touch = false) {
  const rect = canvas.getBoundingClientRect(), x = touch ? event.touches[0].clientX - rect.left : event.clientX - rect.left, y = touch ? event.touches[0].clientY - rect.top : event.clientY - rect.top;
  return { x: isGridEnabled ? Math.round(x / 10) * 10 : x, y: isGridEnabled ? Math.round(y / 10) * 10 : y };
}

function findComponent(x, y) {
  return components.find(comp => {
    const dx = x - (comp.x + comp.width / 2), dy = y - (comp.y + comp.height / 2), cos = Math.cos(-comp.rotation * Math.PI / 180), sin = Math.sin(-comp.rotation * Math.PI / 180), rx = (dx * cos - dy * sin) / comp.scale, ry = (dx * sin + dy * cos) / comp.scale;
    return Math.abs(rx) < comp.width / 2 && Math.abs(ry) < comp.height / 2;
  });
}

export { resizeCanvas, drawCanvas, drawGrid, toggleGrid, getCanvasPosition, findComponent };