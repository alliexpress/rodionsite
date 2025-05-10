class Component {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw(ctx) {
    ctx.fillStyle = this.type === 'resistor' ? '#ff0000' : '#00ff00';
    ctx.fillRect(this.x, this.y, 20, 10);
  }

  update() {
    // Логика обновления компонента (например, физические расчеты)
  }
}

class Connection {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.start.x + 10, this.start.y + 5);
    ctx.lineTo(this.end.x + 10, this.end.y + 5);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

class Simulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.components = [];
    this.connections = [];
  }

  addComponent(component) {
    this.components.push(component);
  }

  addConnection(connection) {
    this.connections.push(connection);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.components.forEach(component => component.draw(this.ctx));
    this.connections.forEach(connection => connection.draw(this.ctx));
  }

  update() {
    this.components.forEach(component => component.update());
    this.draw();
  }
}

function initSimulation(canvasId) {
  const canvas = document.getElementById(canvasId);
  const simulation = new Simulation(canvas);
  return simulation;
}

export { initSimulation, Simulation, Component, Connection };
