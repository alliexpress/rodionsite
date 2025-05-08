// Обработчики событий для взаимодействия с canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let dragging = null;

canvas.addEventListener("mousedown", e => {
  const { x, y } = getCanvasPosition(e);
  dragging = findComponent(x, y);
});

canvas.addEventListener("mousemove", e => {
  if (dragging) {
    const { x, y } = getCanvasPosition(e);
    dragging.x = x;
    dragging.y = y;
    drawCanvas();
  }
});

canvas.addEventListener("mouseup", () => {
  dragging = null;
});