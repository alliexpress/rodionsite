import { initSimulation, Component, Connection } from './simulation.js';
import { initUI } from './ui.js';

let simulation;
let selectedTool = null;

function initEvents() {
  initUI();
  simulation = initSimulation('canvas');

  const toolbar = document.getElementById('toolbar');
  const canvas = document.getElementById('canvas');
  const runButton = document.querySelector('#controlPanel button');

  // Выбор инструмента
  toolbar.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab')) {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      selectedTool = e.target.dataset.tool;
    }
  });

  // Добавление компонентов на canvas
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool && selectedTool !== 'wire') {
      const component = new Component(x, y, selectedTool);
      simulation.addComponent(component);
      simulation.draw();
    }
  });

  // Запуск симуляции
  runButton.addEventListener('click', () => {
    simulation.update();
    document.getElementById('output').textContent = 'Simulation running...';
  });
}

document.addEventListener('DOMContentLoaded', initEvents);