function initUI() {
  const toolbar = document.getElementById('toolbar');
  const controlPanel = document.getElementById('controlPanel');
  const themeToggle = document.getElementById('themeToggle');

  // Создание тулбара
  const tools = ['resistor', 'capacitor', 'wire'];
  tools.forEach(tool => {
    const button = document.createElement('button');
    button.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
    button.className = 'tab bg-white p-2 mx-1 rounded hover:bg-gray-200';
    button.dataset.tool = tool;
    toolbar.appendChild(button);
  });

  // Создание панели управления
  const runButton = document.createElement('button');
  runButton.textContent = 'Run Simulation';
  runButton.className = 'bg-green-600 text-white p-2 rounded hover:bg-green-700';
  controlPanel.appendChild(runButton);

  // Переключение темы
  themeToggle.addEventListener('click', () => {
    const body = document.body;
    const currentTheme = body.dataset.theme;
    body.dataset.theme = currentTheme === 'light' ? 'dark' : 'light';
    themeToggle.textContent = currentTheme === 'light' ? 'Светлая тема' : 'Тёмная тема';
  });
}

export { initUI };
